import { ipcMain } from 'electron';
import BaseWindow, { RegisteredRepository } from './_base.window';
import DofusWindows from '../dofus-windows';

export default class SettingsWindow extends BaseWindow {
  protected slug: 'settings' = 'settings';

  constructor(
    protected registeredRepositories: RegisteredRepository[],
    protected dofusWindows: DofusWindows,
  ) {
    super();

    ipcMain.handle('openSettingsWindow', () => this.open());
    ipcMain.handle('dofusWindows:fetchAll', () => this.dofusWindows.fetchAll());
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      width: 800,
      height: 600,
      alwaysOnTop: false,
    });
  }
}
