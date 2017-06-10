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
ipcMain.on('instanceToggle', (event, dofusInstanceToToggle) => {
    applyInstances(global.dofusInstances.map(dofusInstance => {
        console.log('toggle', dofusInstance, dofusInstanceToToggle);
        if (dofusInstance === dofusInstanceToToggle) {
            return `-${dofusInstanceToToggle}`;
        } else if (dofusInstance === `-${dofusInstanceToToggle}`) {
            return dofusInstanceToToggle;
        }
        return dofusInstance;
    }));
});

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
    applyInstances(dofusInstances);
    configWindow.close();
});

function applyInstances(dofusInstances) {
    global.dofusInstances = dofusInstances;
    settings.set('dofusInstances', dofusInstances);
    setBindings();
    mainWindow.reload();
}

function setBindings() {
    globalShortcut.unregisterAll();
    globalShortcut.register('Tab', () => {
        select(_nextInstance());
    });
    globalShortcut.register('Shift+Tab', () => {
        select(_previousInstance());
    });

    global.dofusInstances.forEach((dofusInstance, index) => {
        globalShortcut.register(`F${index + 1}`, () => {
            select(dofusInstance[0] === '-' ? dofusInstance.substring(1) : dofusInstance);
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

function _activeInstances() {
    return global.dofusInstances.filter(dofusInstance => dofusInstance[0] !== '-');
}
function _nextInstance() {
    const activeInstances = _activeInstances();
    if (activeInstances.length === 0) {
        return null;
    }
    const nextIndex = activeInstances.indexOf(activeInstance) + 1;
    return activeInstances[nextIndex === activeInstances.length ? 0 : nextIndex];
}
function _previousInstance() {
    const activeInstances = _activeInstances();
    if (activeInstances.length === 0) {
        return null;
    }
    const previousIndex = activeInstances.indexOf(activeInstance) - 1;
    return activeInstances[previousIndex === -1 ? activeInstances.length - 1 : previousIndex];
}
