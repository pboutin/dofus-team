const {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu} = require('electron');
const settings = require('electron-settings');
const { parse } = require('yaml');
const fs = require('fs');
const path = require('path');

const config = parse(fs.readFileSync('./config.yml', {encoding: 'utf8'}));
console.log('Loaded config:', config);

const DEVTOOL_OPTIONS = {mode: 'detach'};

let overlayWindow;
let debug = process.argv[2] === 'debug';

let teamState;

function instanciateTeam(teamName) {
  const team = config.teams.find(({name}) => name === teamName);

  return team.members.map((characterName, index) => {
    const characterConfig = config.characters.find(({name}) => name === characterName);
    if (!characterConfig) throw new Error(`Character ${characterName} not found in config.yml`);

    return {
      ...characterConfig,
      active: index === 0,
      disabled: false
    };
  });
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

  overlayWindow.on('closed', () => overlayWindow = null);

  overlayWindow.on('move', () => {
    const [x, y] = overlayWindow.getPosition();
    settings.setSync('position', {x, y});
  });

  if (debug) overlayWindow.webContents.openDevTools(DEVTOOL_OPTIONS);

  teamState = instanciateTeam(config.teams[0].name);

  overlayWindow.webContents.once('dom-ready', () => {
    overlayWindow.send('initialize', {
      teamState,
      positionLocked: !!settings.getSync('position-locked')
    });
  });

  Object.entries(config.shortcuts).forEach(([action, keybind]) => {
    globalShortcut.register(keybind, () => {
      if (action === 'main') {
        const mainCharacter = teamState.find(({main}) => main);
        if (!mainCharacter) return;
        switchActiveCharacter(mainCharacter.name);
      } else if (action === 'next') {
        const currentIndex = teamState.findIndex(({active}) => active);
        const nextIndex = (currentIndex + 1) >= teamState.length ? 0 : currentIndex + 1;
        switchActiveCharacter(teamState[nextIndex].name);
      } else if (action === 'previous') {
        const currentIndex = teamState.findIndex(({active}) => active);
        const nextIndex = (currentIndex - 1) < 0 ? teamState.length - 1 : currentIndex - 1;
        switchActiveCharacter(teamState[nextIndex].name);
      } else if (action.startsWith('team')) {
        const targetIndex = parseInt(action.replace('team', ''), 10) - 1;
        if (targetIndex >= teamState.length) return;
        switchActiveCharacter(teamState[targetIndex].name);
      }
    });
  });

  const tray = new Tray(path.join(__dirname, '/build/icons/icon24x24.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Position locked',
      type: 'checkbox',
      checked: !!settings.getSync('position-locked'),
      click: ({checked}) => {
        overlayWindow.send('position-locked-update', checked);
        settings.setSync('position-locked', checked);
      }
    },
    {
      type: 'separator'
    },
  ]);
  tray.setToolTip('DofusTeam');
  tray.setContextMenu(contextMenu);
}

function switchActiveCharacter(characterName) {
  teamState = teamState.map(character => {
    const isCurrentCharacter = character.name === characterName;

    if (isCurrentCharacter) {
      console.log('Switching to window: ', characterName);
    }

    return {
      ...character,
      active: isCurrentCharacter
    };
  });

  overlayWindow.send('refresh', teamState);
}

ipcMain.on('switch', (_, characterName) => switchActiveCharacter(characterName));

ipcMain.on('disable-toggle', (_, characterName) => {
  teamState = teamState.map(character => {
    const isCurrentCharacter = character.name === characterName;

    return {
      ...character,
      disabled: isCurrentCharacter ? !character.disabled : character.disabled
    };
  });

  overlayWindow.send('refresh', teamState);
});

app.on('ready', () => {
  createOverlayWindow();
});

app.on('window-all-closed', () => app.quit());
