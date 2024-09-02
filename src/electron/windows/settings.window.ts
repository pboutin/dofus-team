import { ipcMain } from 'electron';
import BaseWindow from './_base.window';
import BaseRepository from '../../electron/repositories/_base.repository';
import { GenericModel } from '../../types';

export default class SettingsWindow extends BaseWindow {
  protected slug: 'settings' = 'settings';

  constructor(protected registeredRepositories: BaseRepository<GenericModel>[]) {
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
