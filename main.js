const electron = require('electron');
const {app, BrowserWindow, globalShortcut, ipcMain} = electron;

const path = require('path');
const url = require('url');
const settings = require('electron-settings');
const exec = require('child_process').exec;


let mainWindow;
let configWindow;
let config;
let activeInstance = null;
let debug = false;
global.dofusInstances = null;

if (process.argv[2] === 'debug') {
    console.log('Debug mode : ON');
    debug = true;
}

function createWindow () {
    global.dofusInstances = settings.has('dofusInstances') ? settings.get('dofusInstances') : [];

    let mainWindowOptions = {
        height: settings.has('size.height') ? settings.get('size.height') : 650,
        width: settings.has('size.width') ? settings.get('size.width') : 225,
        alwaysOnTop: true
    };
    if (settings.has('position')) {
        mainWindowOptions.x = settings.get('position.x');
        mainWindowOptions.y = settings.get('position.y');
    }

    mainWindow = new BrowserWindow(mainWindowOptions);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.setMenu(null);

    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.on('move', () => {
        const position = mainWindow.getPosition();
        settings.set('position', { x: position[0], y: position[1] });
    });

    mainWindow.on('resize', () => {
        const size = mainWindow.getSize();
        settings.set('size', { width: size[0], height: size[1] });
    });

    setBindings();

    select(global.dofusInstances[0]);

    if (debug) {
        mainWindow.webContents.openDevTools();
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('instanceSelect', (event, dofusInstance) => select(dofusInstance));

ipcMain.on('openConfig', () => {
    configWindow = new BrowserWindow({
        height: 350,
        width: 300,
        parent: mainWindow,
        modal: true
    });

    configWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'windows/config.html'),
        protocol: 'file:',
        slashes: true
    }));

    configWindow.setMenu(null);

    if (debug) {
        configWindow.webContents.openDevTools();
    }
});

ipcMain.on('dofusInstancesUpdate', (event, dofusInstances) => {
    global.dofusInstances = dofusInstances;
    settings.set('dofusInstances', dofusInstances)
    setBindings()
    mainWindow.reload();
    configWindow.close();
});

function setBindings() {
    globalShortcut.unregisterAll();
    globalShortcut.register('Tab', () => {
        const nextIndex = global.dofusInstances.indexOf(activeInstance) + 1;
        const nextInstance = global.dofusInstances[nextIndex === global.dofusInstances.length ? 0 : nextIndex];
        select(nextInstance);
    });

    global.dofusInstances.forEach((dofusInstance, index) => {
        globalShortcut.register(`F${index + 1}`, () => {
            select(dofusInstance);
        });
    });
}

function select(dofusInstance) {
    if (! dofusInstance) { return; }
    console.log('Switching to : ', dofusInstance);

    if (process.platform === 'linux') {
        _linuxSelect(dofusInstance);
    } else if (process.platform === 'win32') {
        _windowsSelect(dofusInstance);
    } else {
        throw "This OS is not supported yet.";
    }

    activeInstance = dofusInstance;
    mainWindow.send('instanceChange', dofusInstance);
}

function _linuxSelect(windowName) {
    exec("window_id=`xdotool search --name '" + windowName + "'` && xdotool windowactivate $window_id");
}
function _windowsSelect(windowName) {
    exec(`setforegroundwindow-x64.exe "${windowName}"`);
}

