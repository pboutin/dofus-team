import { BrowserWindow } from "electron";

interface Context {
  debug: boolean;
  onOpenedCallbacks: Array<(browserWindow: BrowserWindow) => void>;
}

let settingsBrowserWindow: BrowserWindow | null = null;

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
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
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

  return {
    openSettings,
  };
};
