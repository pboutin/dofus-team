import {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, BrowserWindowConstructorOptions, MenuItemConstructorOptions, nativeImage} from 'electron';
import settings from 'electron-settings';
import path from 'path';
import { exec } from 'child_process';
import Store from 'electron-store';
import crypto from 'crypto';
import { chain } from 'lodash';
import type { Character, Created, InstanciatedTeam, KeyboardShortcut, PersistedCharacter, PersistedKeyboardShortcut, PersistedTeam, Team } from 'common/types';

const store = new Store({
  schema: {
    characters: {
      type: 'array',
      default: []
    },
    teams: {
      type: 'array',
      default: []
    },
    keyboardShortcuts: {
      type: 'array',
      default: []
    },
  }
});

const debug = process.argv[2] === 'debug';

let tray: Tray;
let settingsWindow;
let overlayWindow;
let currentTeam: InstanciatedTeam | null = null;

function instanciateTeam(team: Team): void {
  console.log('Instanciating team... ', team.name, team.id);

  currentTeam = {
    ...team,
    characters: team.characters.map((character, index) => ({
      ...character,
      active: index === 0,
      disabled: false
    }))
  };

  refreshTrayMenu();

  if (currentTeam.characters.length > 0) {
    switchActiveCharacter(currentTeam.characters[0].name);
  }
}

function switchToNext(fromCharacterId?: string) {
  const currentIndex = currentTeam.characters.findIndex(({id, active}) => fromCharacterId ? fromCharacterId === id : active);
  const nextIndex = (currentIndex + 1) >= currentTeam.characters.length ? 0 : currentIndex + 1;
  
  if (currentTeam.characters[nextIndex].disabled) return switchToNext(currentTeam.characters[nextIndex].id);

  switchActiveCharacter(currentTeam.characters[nextIndex].id);
}

function switchToPrevious(fromCharacterId?: string) {
  const currentIndex = currentTeam.characters.findIndex(({id, active}) => fromCharacterId ? fromCharacterId === id : active);
  const nextIndex = (currentIndex - 1) < 0 ? currentTeam.characters.length - 1 : currentIndex - 1;
  
  if (currentTeam.characters[nextIndex].disabled) return switchToPrevious(currentTeam.characters[nextIndex].id);

  switchActiveCharacter(currentTeam.characters[nextIndex].id);
}

function createSettingsWindow() {
  const windowOptions = {
    height: 600,
    width: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  };

  settingsWindow = new BrowserWindow(windowOptions);
  settingsWindow.loadFile('./settings.html');
  settingsWindow.setMenu(null);
  settingsWindow.on('closed', () => settingsWindow = null);

  if (debug) settingsWindow.webContents.openDevTools({mode: 'detach'});
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

  // overlayWindow.webContents.once('dom-ready', () => instanciateTeam(config.teams[0].name));
}

function refreshTrayMenu() {
  console.log('Refreshing tray menu...');

  const characterItems: MenuItemConstructorOptions[] = (currentTeam?.characters ?? []).map(({id, name, disabled}) => ({
    label: name,
    type: 'checkbox',
    checked: !disabled,
    click: () => disableToggleCharacter(id)
  }));

  if (characterItems.length > 0) {
    characterItems.unshift({
      label: 'Enable all',
      click: enableAllCharacters
    })
    characterItems.push({
      type: 'separator'
    });
  }

  const teamItems: MenuItemConstructorOptions[] = getTeams().map((team) => ({
    label: team.name,
    type: 'radio',
    checked: currentTeam?.id === team.id,
    click: () => instanciateTeam(team)
  }));

  if (teamItems.length > 0) {
    teamItems.push({
      label: 'Foo',
      type: 'separator'
    });
  }

  const overalayItems: MenuItemConstructorOptions[] = [
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
  ];

  const generalItems = [
    {
      label: 'Settings',
      click: createSettingsWindow
    },
    {
      label: 'Close',
      click: app.quit
    }
  ];
  
  tray.setContextMenu(
    Menu.buildFromTemplate([
      ...characterItems,
      ...teamItems,
      ...overalayItems,
      ...generalItems
    ])
  );
}

function registerShortcuts() {
  globalShortcut.unregisterAll();
  getKeyboardShortcuts().forEach((shortcut: KeyboardShortcut) => {
    globalShortcut.register(shortcut.keybind, () => {
      switch(shortcut.action) {
        case 'GOTO_NEXT':
          switchToNext();
          break;
        case 'GOTO_PREVIOUS':
          switchToPrevious();
          break;
        case 'GOTO_1':
        case 'GOTO_2':
        case 'GOTO_3':
        case 'GOTO_4':
        case 'GOTO_5':
        case 'GOTO_6':
        case 'GOTO_7':
        case 'GOTO_8':
          const targetIndex = parseInt(shortcut.action.replace('GOTO_', ''), 10) - 1;
          if (!currentTeam || targetIndex >= currentTeam.characters.length) return;
          switchActiveCharacter(currentTeam.characters[targetIndex].name);
          break;
        case 'GOTO_CHARACTER':
          const targetCharacter = getCharacters().find(({id}) => id === shortcut.argument);
          if (!targetCharacter) return;
          switchActiveCharacter(targetCharacter.name);
          break;
        case 'SWITCH_TEAM':
          const targetTeam = getTeams().find(({id}) => id === shortcut.argument);
          if (!targetTeam) return;
          instanciateTeam(targetTeam);
          break;
      }
    });
  });
}

function switchActiveCharacter(characterId) {
  currentTeam.characters = currentTeam.characters.map(character => {
    const isCurrentCharacter = character.id === characterId;

    if (isCurrentCharacter) {
      const windowName = `"${character.name} - Dofus"`;
      console.log('Switching to window: ', windowName);
      if (!debug) exec(`windows_activate.vbs ${windowName}`);
    }

    return {
      ...character,
      active: isCurrentCharacter
    };
  });
}

function enableAllCharacters() {
  currentTeam.characters = currentTeam.characters.map(character => ({
    ...character,
    disabled: false
  }));
}

function disableToggleCharacter(characterId) {
  currentTeam.characters = currentTeam.characters.map(character => ({
    ...character,
    disabled: character.id === characterId ? !character.disabled : character.disabled
  }));
}

app.on('ready', async () => {
  console.log('App ready, initializing...');
  tray = new Tray(path.join(__dirname, '../build/icons/icon24x24.png'), 'dofus-team');
  tray.setToolTip('DofusTeam');

  const teams = getTeams();
  if (teams.length > 0) {
    instanciateTeam(teams[0]);
  } else {
    refreshTrayMenu();
  }

  createSettingsWindow();
  registerShortcuts();
});

app.on('window-all-closed', () => app.quit());

function getCharacters(): Character[] {
  return store.get('characters', []) as PersistedCharacter[];
}

function persistCharacters(characters: Character[]) {
  store.set('characters', characters);
}

function getTeams(): Team[] {
  const charactersMap = getCharacters().reduce((acc, character) => {
    acc[character.id] = character;
    return acc;
  }, {} as Record<string, Character>);

  return (store.get('teams', []) as PersistedTeam[]).map(team => ({
    ...team,
    characters: team.characterIds.map(characterId => charactersMap[characterId])
  }));
}

function persistTeams(teams: Team[]) {
  store.set('teams', teams.map(team => ({
    ...team,
    characterIds: team.characters.map(character => character.id)
  })));
}

function getKeyboardShortcuts(): KeyboardShortcut[] {
  return store.get('keyboardShortcuts', []) as PersistedKeyboardShortcut[];
}

function persistKeyboardShortcuts(keyboardShortcuts: KeyboardShortcut[]) {
  store.set('keyboardShortcuts', keyboardShortcuts);
}

store.onDidChange('characters', (characters) => {
  settingsWindow.webContents.send('charactersChanged', characters);
});

store.onDidChange('teams', (teams) => {
  settingsWindow.webContents.send('teamsChanged', teams);
});

store.onDidChange('keyboardShortcuts', (keyboardShortcuts) => {
  settingsWindow.webContents.send('keyboardShortcutsChanged', keyboardShortcuts);
});

ipcMain.handle('getCharacters', async () => {
  return Promise.resolve(getCharacters());
});

ipcMain.handle('upsertCharacter', (event, character: Character | Created<Character>) => {
  const characters = getCharacters();

  if (character.id) {
    persistCharacters(characters.map(existingCharacter => existingCharacter.id === character.id ? character : existingCharacter));
    return;
  }

  persistCharacters([...characters, {
    ...character,
    id: crypto.randomUUID()
  }]);
});

ipcMain.handle('removeCharacter', (event, characterId: string) => {
  const characters = getCharacters();
  persistCharacters(characters.filter(({id}) => id !== characterId));
});

ipcMain.handle('duplicateCharacter', (event, characterId: string) => {
  const characters = getCharacters();
  persistCharacters(chain(characters)
    .map((character) => character.id === characterId ? [character, {...character, name: `${character.name}*`, id: crypto.randomUUID()}] : character)
    .flatten()
    .value()
  );
});

ipcMain.handle('reorderCharacters', (event, characterIds: string[]) => {
  const characters = getCharacters();
  persistCharacters(characterIds.map(id => characters.find(character => character.id === id)));
});

ipcMain.handle('getTeams', () => {
  return getTeams();
});

ipcMain.handle('upsertTeam', (event, team: Team | Created<Team>) => {
  const teams = getTeams();

  if (team.id) {
    persistTeams(teams.map(existingTeam => existingTeam.id === team.id ? team : existingTeam));
    return;
  }

  persistTeams([...teams, {
    ...team,
    id: crypto.randomUUID()
  }]);
});

ipcMain.handle('removeTeam', (event, teamId: string) => {
  const teams = getTeams();
  persistTeams(teams.filter(({id}) => id !== teamId));
});

ipcMain.handle('duplicateTeam', (event, teamId: string) => {
  const teams = getTeams();
  persistTeams(chain(teams)
    .map((team) => team.id === teamId ? [team, {...team, name: `${team.name}*`, id: crypto.randomUUID()}] : team)
    .flatten()
    .value()
  );
});

ipcMain.handle('reorderTeams', (event, teamIds: string[]) => {
  const teams = getTeams();
  persistTeams(teamIds.map(id => teams.find(team => team.id === id)));
});

ipcMain.handle('getKeyboardShortcuts', () => {
  return getKeyboardShortcuts();
});

function removeMatchingKeyboardShortcut(keyboardShortcuts: KeyboardShortcut[], keyboardShortcut: Omit<KeyboardShortcut, 'keybind'>) {
  return keyboardShortcuts.filter(currentShortcut => {
    if (currentShortcut.action !== keyboardShortcut.action) return true;
    if (keyboardShortcut.argument && currentShortcut.argument !== keyboardShortcut.argument) return true;
    return false;
  });
}

ipcMain.handle('deleteKeyboardShortcut', (event, keyboardShortcut: Omit<KeyboardShortcut, 'keybind'>) => {
  const keyboardShortcuts = getKeyboardShortcuts();
  persistKeyboardShortcuts(removeMatchingKeyboardShortcut(keyboardShortcuts, keyboardShortcut));
});

ipcMain.handle('updateKeyboardShortcut', (event, keyboardShortcut: KeyboardShortcut) => {
  const keyboardShortcuts = getKeyboardShortcuts();
  console.log(keyboardShortcuts);
  console.log(keyboardShortcut);
  persistKeyboardShortcuts([
    ...removeMatchingKeyboardShortcut(keyboardShortcuts, keyboardShortcut),
    keyboardShortcut
  ]);
});
