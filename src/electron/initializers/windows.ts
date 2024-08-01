import { app, BrowserWindow } from 'electron';
import settings from 'electron-settings';
import path from 'path';

type PositionSetting = { x: number; y: number } | undefined;

interface Context {
  debug: boolean;
  onOpenedCallbacks: Array<(browserWindow: BrowserWindow) => void>;
}

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

let settingsBrowserWindow: BrowserWindow | null = null;
let dashboardBrowserWindow: BrowserWindow | null = null;

const BASE_HTML_PATH = '../';

let debounceId = null;
const debounceSettingsSet = (key, value) => {
  clearTimeout(debounceId);
  debounceId = setTimeout(() => {
    settings.setSync(key, value);
  }, 1000);
};

export const initializeWindows = ({ debug, onOpenedCallbacks }: Context) => {
  const openSettings = async () => {
    if (settingsBrowserWindow) {
      settingsBrowserWindow.show();
    }

    const position = settings.getSync('position') as PositionSetting;

    const browserWindow = new BrowserWindow({
      ...(position ?? {}),
      height: 600,
      width: 800,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, '../../build/icon.ico'),
    });

    browserWindow.loadFile(`${BASE_HTML_PATH}settings.html`);
    browserWindow.setMenu(null);
    browserWindow.on('closed', () => (settingsBrowserWindow = null));

    browserWindow.on('move', async () => {
      const { x, y } = browserWindow.getBounds();
      debounceSettingsSet('position', { x, y });
    });

    if (debug) {
      browserWindow.on('ready-to-show', () => {
        browserWindow.webContents.openDevTools({ mode: 'detach' });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    settingsBrowserWindow = browserWindow;
    return browserWindow;
  };

  const openDashboard = async () => {
    if (dashboardBrowserWindow) {
      dashboardBrowserWindow.show();
    }

    const position = (await settings.get('dashboard:position')) as PositionSetting;

    const browserWindow = new BrowserWindow({
      ...(position ?? {}),
      height: 620,
      width: 475,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, '../../build/icon.ico'),
    });

    browserWindow.loadFile(`${BASE_HTML_PATH}dashboard.html`);
    browserWindow.setMenu(null);
    browserWindow.on('closed', () => (dashboardBrowserWindow = null));

    browserWindow.on('move', async () => {
      const { x, y } = browserWindow.getBounds();
      debounceSettingsSet('dashboard:position', { x, y });
    });

    if (debug) {
      browserWindow.on('ready-to-show', () => {
        browserWindow.webContents.openDevTools({ mode: 'detach' });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    dashboardBrowserWindow = browserWindow;
    return browserWindow;
  };

  return {
    openSettings,
    openDashboard,
    setAlwaysOnTop: (alwaysOnTop: boolean) => {
      dashboardBrowserWindow?.setAlwaysOnTop(alwaysOnTop);
    },
  };
};
