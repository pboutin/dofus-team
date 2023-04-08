import {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, BrowserWindowConstructorOptions} from 'electron';
import settings from 'electron-settings';
import { parse } from 'yaml';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import Store from 'electron-store';
import crypto from 'crypto';
import { chain, flatten, map } from 'lodash';
import { Character, Created, Team } from 'common/types';

const config = parse(fs.readFileSync('./config.yml', {encoding: 'utf8'}));

const store = new Store({
  schema: {
    characters: {
      type: 'array',
      default: []
    },
    teams: {
      type: 'array',
      default: []
    }
  }
});

let appWindow;
let overlayWindow;
let debug = process.argv[2] === 'debug';
let tray;
let activeTeamCharacters;

function instanciateTeam(teamName) {
  const team = config.teams.find(({name}) => name === teamName);

  activeTeamCharacters = team.members.map((characterName, index) => {
    const characterConfig = config.characters.find(({name}) => name === characterName);
    if (!characterConfig) throw new Error(`Character ${characterName} not found in config.yml`);

    return {
      ...characterConfig,
      active: index === 0,
      disabled: false
    };
  });

  overlayWindow.send('initialize', {
    activeTeamCharacters,
    positionLocked: !!settings.getSync('overlay-locked')
  });

  tray.setContextMenu(createContextMenu(teamName));

  switchActiveCharacter(team.members[0]);
}

function goToNext(fromCharacterName?: string) {
  const currentIndex = activeTeamCharacters.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex + 1) >= activeTeamCharacters.length ? 0 : currentIndex + 1;
  
  if (activeTeamCharacters[nextIndex].disabled) return goToNext(activeTeamCharacters[nextIndex].name);

  switchActiveCharacter(activeTeamCharacters[nextIndex].name);
}

function goToPrevious(fromCharacterName?: string) {
  const currentIndex = activeTeamCharacters.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex - 1) < 0 ? activeTeamCharacters.length - 1 : currentIndex - 1;
  
  if (activeTeamCharacters[nextIndex].disabled) return goToPrevious(activeTeamCharacters[nextIndex].name);

  switchActiveCharacter(activeTeamCharacters[nextIndex].name);
}

function createAppWindow() {
  const windowOptions = {
    height: 600,
    width: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  };

  appWindow = new BrowserWindow(windowOptions);
  appWindow.loadFile('./app.html');
  appWindow.setMenu(null);
  appWindow.on('closed', () => appWindow = null);

  if (debug) appWindow.webContents.openDevTools({mode: 'detach'});
}

function createOverlayWindow() {
  const windowOptions: BrowserWindowConstructorOptions = {
    height: 120,
    width: 800,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  };

  if (settings.hasSync('position')) {
    windowOptions.x = settings.getSync('position.x') as number;
    windowOptions.y = settings.getSync('position.y') as number;
  }

  overlayWindow = new BrowserWindow(windowOptions);
  overlayWindow.loadFile('./overlay.html');
  overlayWindow.setMenu(null);
  overlayWindow.setIgnoreMouseEvents(!!settings.getSync('overlay-locked'));
  overlayWindow.on('closed', () => overlayWindow = null);

  overlayWindow.on('move', () => {
    const [x, y] = overlayWindow.getPosition();
    settings.setSync('position', {x, y});
  });

  if (debug) overlayWindow.webContents.openDevTools({mode: 'detach'});

  overlayWindow.webContents.once('dom-ready', () => instanciateTeam(config.teams[0].name));

  Object.entries<string>(config.shortcuts).forEach(([action, keybind]) => {
    globalShortcut.register(keybind, () => {
      if (action === 'main') {
        const mainCharacter = activeTeamCharacters.find(({main}) => main);
        if (!mainCharacter) return;
        switchActiveCharacter(mainCharacter.name);
      } else if (action === 'next') {
        if (activeTeamCharacters.every(({disabled}) => disabled)) return;
        goToNext();
      } else if (action === 'previous') {
        if (activeTeamCharacters.every(({disabled}) => disabled)) return;
        goToPrevious();
      } else if (action.startsWith('team')) {
        const targetIndex = parseInt(action.replace('team', ''), 10) - 1;
        if (targetIndex >= activeTeamCharacters.length) return;
        switchActiveCharacter(activeTeamCharacters[targetIndex].name);
      }
    });
  });

  tray = new Tray(path.join(__dirname, '/build/icons/icon24x24.png'));
  tray.setToolTip('DofusTeam');
}

function createContextMenu(activeTeamName) {
  return Menu.buildFromTemplate([
    {
      label: 'Position locked',
      type: 'checkbox',
      checked: !!settings.getSync('overlay-locked'),
      click: ({checked}) => {
        overlayWindow.send(checked ? 'overlay-lock' : 'overlay-unlock');
        settings.setSync('overlay-locked', checked);
        overlayWindow.setIgnoreMouseEvents(checked);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Enable all',
      click: () => enableAllCharacters()
    },
    ...activeTeamCharacters.map(({disabled, name}) => ({
      label: name,
      type: 'checkbox',
      checked: !disabled,
      click: () => toggleCharacter(name)
    })),
    {
      type: 'separator'
    },
    ...config.teams.map((team) => ({
      label: team.name,
      type: 'radio',
      checked: team.name === activeTeamName,
      click: () => instanciateTeam(team.name)
    })),
    {
      type: 'separator'
    },
    {
      label: 'Close',
      click: () => app.quit()
    }
  ]);
}

function switchActiveCharacter(characterName) {
  activeTeamCharacters = activeTeamCharacters.map(character => {
    const isCurrentCharacter = character.name === characterName;

    if (isCurrentCharacter) {
      const windowName = `"${characterName} - Dofus"`;
      console.log('Switching to window: ', windowName);
      if (!debug) exec(`windows_activate.vbs ${windowName}`);
    }

    return {
      ...character,
      active: isCurrentCharacter
    };
  });

  overlayWindow.send('refresh', activeTeamCharacters);
}

function enableAllCharacters() {
  activeTeamCharacters = activeTeamCharacters.map(character => ({
    ...character,
    disabled: false
  }));

  overlayWindow.send('refresh', activeTeamCharacters);
}

function toggleCharacter(characterName) {
  activeTeamCharacters = activeTeamCharacters.map(character => {
    const isCurrentCharacter = character.name === characterName;

    return {
      ...character,
      disabled: isCurrentCharacter ? !character.disabled : character.disabled
    };
  });

  overlayWindow.send('refresh', activeTeamCharacters);
}

app.on('ready', () => {
  // createOverlayWindow();
  createAppWindow();
});

app.on('window-all-closed', () => app.quit());

store.onDidChange('characters', (characters) => {
  appWindow.webContents.send('charactersChanged', characters);
});

store.onDidChange('teams', (teams) => {
  appWindow.webContents.send('teamsChanged', teams);
});

ipcMain.handle('getCharacters', () => {
  return store.get('characters');
});

ipcMain.handle('upsertCharacter', (event, character: Character | Created<Character>) => {
  const characters = store.get('characters', []) as Character[];

  if (character.id) {
    store.set('characters', characters.map(existingCharacter => existingCharacter.id === character.id ? character : existingCharacter));
    return;
  }

  store.set('characters', [...characters, {
    ...character,
    id: crypto.randomUUID()
  }]);
});

ipcMain.handle('removeCharacter', (event, characterId: string) => {
  const characters = store.get('characters', []) as Character[];
  store.set('characters', characters.filter(({id}) => id !== characterId));
});

ipcMain.handle('duplicateCharacter', (event, characterId: string) => {
  const characters = store.get('characters', []) as Character[];
  store.set('characters', chain(characters)
    .map((character) => character.id === characterId ? [character, {...character, name: `${character.name}*`, id: crypto.randomUUID()}] : character)
    .flatten()
    .value()
  );
});

ipcMain.handle('reorderCharacters', (event, characterIds: string[]) => {
  const characters = store.get('characters', []) as Character[];
  store.set('characters', characterIds.map(id => characters.find(character => character.id === id)));
});

ipcMain.handle('getTeams', () => {
  return store.get('teams');
});

ipcMain.handle('upsertTeam', (event, team: Team | Created<Team>) => {
  const teams = store.get('teams', []) as Team[];

  if (team.id) {
    store.set('teams', teams.map(existingTeam => existingTeam.id === team.id ? team : existingTeam));
    return;
  }

  store.set('teams', [...teams, {
    ...team,
    id: crypto.randomUUID()
  }]);
});

ipcMain.handle('removeTeam', (event, teamId: string) => {
  const teams = store.get('teams', []) as Team[];
  store.set('teams', teams.filter(({id}) => id !== teamId));
});

ipcMain.handle('duplicateTeam', (event, teamId: string) => {
  const teams = store.get('teams', []) as Team[];
  store.set('teams', chain(teams)
    .map((team) => team.id === teamId ? [team, {...team, name: `${team.name}*`, id: crypto.randomUUID()}] : team)
    .flatten()
    .value()
  );
});

ipcMain.handle('reorderTeams', (event, teamIds: string[]) => {
  const teams = store.get('teams', []) as Team[];
  store.set('teams', teamIds.map(id => teams.find(team => team.id === id)));
});
