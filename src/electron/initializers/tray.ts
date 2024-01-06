import { Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron';
import settings from 'electron-settings';
import path from 'path';

interface Context {
  debug: boolean;
  hardReset: () => void;
  openSettings: () => void;
  openDashboard: () => void;
  onAlwaysOnTopChange: (alwaysOnTop: boolean) => void;
  onClose: () => void;
}

let tray: Tray | null = null;

export const initializeTray = ({
  debug,
  hardReset,
  openSettings,
  openDashboard,
  onAlwaysOnTopChange,
  onClose,
}: Context) => {
  tray = new Tray(path.join(__dirname, '../../build/icon24x24.png'));

  tray.setToolTip('DofusTeam');

  const menuItems: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Toujours au dessus',
      type: 'checkbox',
      checked: !!settings.getSync('alwaysOnTop'),
      click: () => {
        const updatedAlwaysOnTop = !settings.getSync('alwaysOnTop');
        settings.setSync('alwaysOnTop', updatedAlwaysOnTop);
        onAlwaysOnTopChange(updatedAlwaysOnTop);
      },
    },
    {
      label: 'Settings',
      click: openSettings,
    },
    {
      label: 'Afficher',
      click: openDashboard,
    },
    {
      label: 'Close',
      click: onClose,
    },
  ];

  if (debug) {
    menuItems.push({
      label: 'Hard reset',
      click: hardReset,
    });
  }

  tray.setContextMenu(Menu.buildFromTemplate(menuItems));
};
