import { app, BrowserWindow } from "electron";

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

export const initializeWindows = ({ debug, onOpenedCallbacks }: Context) => {
  const openSettings = () => {
    if (settingsBrowserWindow) {
      settingsBrowserWindow.show();
      return settingsBrowserWindow;
    }

    const browserWindow = new BrowserWindow({
      height: 600,
      width: 800,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
    });

    browserWindow.loadFile("./settings.html");
    browserWindow.setMenu(null);
    browserWindow.on("closed", () => (settingsBrowserWindow = null));

    if (debug) {
      browserWindow.on("ready-to-show", () => {
        browserWindow.webContents.openDevTools({ mode: "detach" });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    settingsBrowserWindow = browserWindow;
    return browserWindow;
  };

  const openDashboard = () => {
    if (dashboardBrowserWindow) {
      dashboardBrowserWindow.show();
      return dashboardBrowserWindow;
    }

    const browserWindow = new BrowserWindow({
      height: 580,
      width: 600,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
    });

    browserWindow.loadFile("./dashboard.html");
    browserWindow.setMenu(null);
    browserWindow.on("closed", () => app.quit());

    if (debug) {
      browserWindow.on("ready-to-show", () => {
        browserWindow.webContents.openDevTools({ mode: "detach" });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    dashboardBrowserWindow = browserWindow;
    return browserWindow;
  };

  return {
    openSettings,
    openDashboard,
  };
};
