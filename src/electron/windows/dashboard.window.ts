import { app, ipcMain } from 'electron';
import settings from 'electron-settings';
import BaseWindow from './_base.window';
import BaseRepository from 'src/electron/repositories/_base.repository';
import { GenericModel } from 'src/types';

export default class DashboardWindow extends BaseWindow {
  protected slug: 'dashboard' = 'dashboard';

  constructor(protected registeredRepositories: BaseRepository<GenericModel>[]) {
    super();

    ipcMain.handle('dashboardAlwaysOnTop:fetch', () => this.alwaysOnTopSetting);
    ipcMain.handle('dashboardAlwaysOnTop:set', (_, alwaysOnTop: boolean) => {
      this.window?.setAlwaysOnTop(alwaysOnTop);
      settings.setSync(this.alwaysOnTopSettingKey, alwaysOnTop);
    });
  }

  get alwaysOnTopSettingKey() {
    return `${this.slug}:alwaysOnTop`;
  }

  get alwaysOnTopSetting() {
    return settings.getSync(this.alwaysOnTopSettingKey) as boolean;
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      htmlFile: 'dashboard.html',
      height: 665,
      width: 475,
      alwaysOnTop: this.alwaysOnTopSetting,
    });

    this.window.on('close', () => app.quit());
  }
}
