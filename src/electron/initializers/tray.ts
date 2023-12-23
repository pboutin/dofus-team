import { Menu, Tray } from "electron";
import path from "path";

interface Context {
  onOpenSettings: () => void;
  onClose: () => void;
}

let tray: Tray | null = null;

export const initializeTray = ({ onOpenSettings, onClose }: Context) => {
  tray = new Tray(
    path.join(__dirname, "../../build/icon24x24.png"),
    "dofus-team"
  );

  tray.setToolTip("DofusTeam");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Settings",
        click: onOpenSettings,
      },
      {
        label: "Close",
        click: onClose,
      },
    ])
  );
};
