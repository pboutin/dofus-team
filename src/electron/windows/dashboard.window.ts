import { app, ipcMain } from 'electron';
import settings from 'electron-settings';
import BaseWindow, { RegisteredRepository } from './_base.window';

export default class DashboardWindow extends BaseWindow {
  protected slug: 'dashboard' = 'dashboard';

  constructor(protected registeredRepositories: RegisteredRepository[]) {
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
      height: 665,
      width: 475,
      alwaysOnTop: this.alwaysOnTopSetting,
    });

    this.window.on('close', () => app.quit());
  }
}
