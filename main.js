const {app, BrowserWindow, ipcMain} = require('electron');
const settings = require('electron-settings');
const { parse } = require('yaml');
const fs = require('fs');

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

  if (settings.has('position')) {
    windowOptions.x = settings.get('position.x');
    windowOptions.y = settings.get('position.y');
  }

  overlayWindow = new BrowserWindow(windowOptions);

  overlayWindow.loadFile('./overlay.html');

  overlayWindow.setMenu(null);

  overlayWindow.on('closed', () => overlayWindow = null);

  overlayWindow.on('move', () => {
    const [x, y] = overlayWindow.getPosition();
    settings.set('position', {x, y});
  });

  if (debug) overlayWindow.webContents.openDevTools(DEVTOOL_OPTIONS);

  teamState = instanciateTeam(config.teams[0].name);


  overlayWindow.webContents.once('dom-ready', () => {
    overlayWindow.send('initialize', teamState);
  });
}

ipcMain.on('switch', (_, characterName) => {
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
});

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
