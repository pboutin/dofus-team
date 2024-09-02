import { ipcMain } from 'electron';
import BaseWindow, { RegisteredRepository } from './_base.window';

export default class SettingsWindow extends BaseWindow {
  protected slug: 'settings' = 'settings';

  constructor(protected registeredRepositories: RegisteredRepository[]) {
    super();

    ipcMain.handle('openSettingsWindow', () => this.open());
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      htmlFile: 'settings.html',
      width: 800,
      height: 600,
      alwaysOnTop: false,
    });
  }
}
