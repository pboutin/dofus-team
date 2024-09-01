import { app, Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron';
import { inject, singleton } from 'tsyringe';
import Store from 'electron-store';
import path from 'path';
import DashboardWindow from './windows/dashboard.window';
import SettingsWindow from './windows/settings.window';

@singleton()
export default class SystemTray {
  private tray: Tray;

  constructor(
    @inject('store') private store: Store,
    private dashboardWindow: DashboardWindow,
    private settingsWindow: SettingsWindow,
  ) {
    this.tray = new Tray(path.join(__dirname, '../build/icon24x24.png'));
    this.tray.setToolTip('DofusTeam');

    const menuItems: Array<MenuItemConstructorOptions | MenuItem> = [
      {
        label: 'Toujours au dessus',
        type: 'checkbox',
        checked: dashboardWindow.alwaysOnTopSetting,
        click: () => dashboardWindow.toggleAlwaysOnTop(),
      },
      {
        label: 'Settings',
        click: () => settingsWindow.open(),
      },
      {
        label: 'Afficher',
        click: () => dashboardWindow.open(),
      },
      {
        label: 'Close',
        click: () => app.quit(),
      },
    ];

    this.tray.setContextMenu(Menu.buildFromTemplate(menuItems));
  }
}
