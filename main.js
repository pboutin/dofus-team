const {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu} = require('electron');
const settings = require('electron-settings');
const { parse } = require('yaml');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const config = parse(fs.readFileSync('./config.yml', {encoding: 'utf8'}));
console.log('Loaded config:', config);

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

function goToNext(fromCharacterName) {
  const currentIndex = activeTeamCharacters.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex + 1) >= activeTeamCharacters.length ? 0 : currentIndex + 1;
  
  if (activeTeamCharacters[nextIndex].disabled) return goToNext(activeTeamCharacters[nextIndex].name);

  switchActiveCharacter(activeTeamCharacters[nextIndex].name);
}

function goToPrevious(fromCharacterName) {
  const currentIndex = activeTeamCharacters.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex - 1) < 0 ? activeTeamCharacters.length - 1 : currentIndex - 1;
  
  if (activeTeamCharacters[nextIndex].disabled) return goToPrevious(activeTeamCharacters[nextIndex].name);

  switchActiveCharacter(activeTeamCharacters[nextIndex].name);
}

function createOverlayWindow() {
  const windowOptions = {
    height: 120,
    width: 800,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  };

  if (settings.hasSync('position')) {
    windowOptions.x = settings.getSync('position.x');
    windowOptions.y = settings.getSync('position.y');
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

  Object.entries(config.shortcuts).forEach(([action, keybind]) => {
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
    }))
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
  createOverlayWindow();
});

app.on('window-all-closed', () => app.quit());
