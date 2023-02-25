const {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu} = require('electron');
const settings = require('electron-settings');
const { parse } = require('yaml');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const config = parse(fs.readFileSync('./config.yml', {encoding: 'utf8'}));
console.log('Loaded config:', config);

const DEVTOOL_OPTIONS = {mode: 'detach'};

let overlayWindow;
let debug = process.argv[2] === 'debug';


let teamState;

function instanciateTeam(teamName) {
  const team = config.teams.find(({name}) => name === teamName);

  teamState = team.members.map((characterName, index) => {
    const characterConfig = config.characters.find(({name}) => name === characterName);
    if (!characterConfig) throw new Error(`Character ${characterName} not found in config.yml`);

    return {
      ...characterConfig,
      active: index === 0,
      disabled: false
    };
  });

  overlayWindow.send('initialize', {
    teamState,
    positionLocked: !!settings.getSync('position-locked')
  });

  switchActiveCharacter(team.members[0]);
}

function goToNext(fromCharacterName) {
  const currentIndex = teamState.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex + 1) >= teamState.length ? 0 : currentIndex + 1;
  
  if (teamState[nextIndex].disabled) return goToNext(teamState[nextIndex].name);

  switchActiveCharacter(teamState[nextIndex].name);
}

function goToPrevious(fromCharacterName) {
  const currentIndex = teamState.findIndex(({name, active}) => fromCharacterName ? fromCharacterName === name : active);
  const nextIndex = (currentIndex - 1) < 0 ? teamState.length - 1 : currentIndex - 1;
  
  if (teamState[nextIndex].disabled) return goToPrevious(teamState[nextIndex].name);

  switchActiveCharacter(teamState[nextIndex].name);
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

  overlayWindow.webContents.once('dom-ready', () => instanciateTeam(config.teams[0].name));

  Object.entries(config.shortcuts).forEach(([action, keybind]) => {
    globalShortcut.register(keybind, () => {
      if (action === 'main') {
        const mainCharacter = teamState.find(({main}) => main);
        if (!mainCharacter) return;
        switchActiveCharacter(mainCharacter.name);
      } else if (action === 'next') {
        if (teamState.every(({disabled}) => disabled)) return;
        goToNext();
      } else if (action === 'previous') {
        if (teamState.every(({disabled}) => disabled)) return;
        goToPrevious();
      } else if (action.startsWith('team')) {
        const targetIndex = parseInt(action.replace('team', ''), 10) - 1;
        if (targetIndex >= teamState.length) return;
        switchActiveCharacter(teamState[targetIndex].name);
      }
    });
  });

  const tray = new Tray(path.join(__dirname, '/build/icons/icon24x24.png'));
  const teamRadios = config.teams.map((team, index) => ({
    label: team.name,
    type: 'radio',
    checked: index === 0,
    click: (currentRadio) => {
      teamRadios.forEach(teamRadio => teamRadio.checked = false);
      currentRadio = true;

      instanciateTeam(team.name);
    }
  }));
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
  ].concat(teamRadios));
  tray.setToolTip('DofusTeam');
  tray.setContextMenu(contextMenu);
}

function switchActiveCharacter(characterName) {
  teamState = teamState.map(character => {
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
