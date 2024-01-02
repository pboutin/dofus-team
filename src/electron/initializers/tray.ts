import { Menu, Tray } from 'electron';
import path from 'path';

interface Context {
  debug: boolean;
  hardReset: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
}

let tray: Tray | null = null;

export const initializeTray = ({ debug, hardReset, onOpenSettings, onClose }: Context) => {
  tray = new Tray(path.join(__dirname, '../../build/icon24x24.png'), 'dofus-team');

  tray.setToolTip('DofusTeam');

  const menuItems = [
    {
      label: 'Settings',
      click: onOpenSettings,
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
