import { BrowserWindow } from 'electron';
import settings from 'electron-settings';
import path from 'path';
import BaseRepository from '../repositories/_base.repository';
import { GenericModel } from '../../types';
import translations from '../../translations';
import packageJson from '../../../package.json';

export type PositionSetting = { x: number; y: number } | null;

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

export default class BaseWindow {
  private debouncedUpdatePositionSettingsId: NodeJS.Timeout;

  protected slug: 'dashboard' | 'settings';
  protected window: BrowserWindow | null = null;
  protected registeredRepositories: BaseRepository<GenericModel>[];

  get positionSettingKey() {
    return `${this.slug}:position`;
  }

  get positionSetting() {
    return settings.getSync(this.positionSettingKey) as PositionSetting;
  }

  protected createWindow({
    htmlFile,
    width,
    height,
    alwaysOnTop,
  }: {
    htmlFile: string;
    width: number;
    height: number;
    alwaysOnTop: boolean;
  }) {
    this.window = new BrowserWindow({
      ...(this.positionSetting ?? {}),
      height,
      width,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, '../../build/icon.ico'),
      alwaysOnTop,
      title: this.getWindowTitle(),
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/${htmlFile}`);
    } else {
      this.window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/${htmlFile}`));
    }

    this.window.setMenu(null);

    this.window.on('move', async () => {
      const { x, y } = this.window.getBounds();
      this.debouncedUpdatePositionSettings({ x, y });
    });

    this.registeredRepositories.forEach((repository) => {
      const unsubscribe = repository.onChange((items) => {
        if (this.window.isDestroyed()) return;
        this.window.webContents.send(`${repository.modelName}:changed`, items);
      });

      this.window.on('closed', unsubscribe);
    });

    this.window.on('closed', (): void => (this.window = null));
  }

  private debouncedUpdatePositionSettings(position: PositionSetting) {
    clearTimeout(this.debouncedUpdatePositionSettingsId);
    this.debouncedUpdatePositionSettingsId = setTimeout(() => {
      settings.setSync(this.positionSettingKey, position);
    }, 1000);
  }

  private getWindowTitle() {
    const segments = ['DofusTeam'];

    if (translations.window[this.slug].title) {
      segments.push(translations.window[this.slug].title);
    }

    segments.push(`v${packageJson.version}`);

    return segments.join(' - ');
  }
}
