import { BrowserWindow } from 'electron';
import settings from 'electron-settings';
import path from 'path';
import BaseRepository from '../repositories/_base.repository';
import { GenericModel } from '../../types';
import translations from '../../translations';
import packageJson from '../../../package.json';
import ConfigRepository from '../repositories/config.repository';

export type PositionSetting = { x: number; y: number } | null;
export type RegisteredRepository = BaseRepository<GenericModel> | ConfigRepository;

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

export default class BaseWindow {
  private debouncedUpdatePositionSettingsId: NodeJS.Timeout;

  protected slug: 'dashboard' | 'settings';
  protected window: BrowserWindow | null = null;
  protected registeredRepositories: RegisteredRepository[];

  get positionSettingKey() {
    return `${this.slug}:position`;
  }

  get positionSetting() {
    return settings.getSync(this.positionSettingKey) as PositionSetting;
  }

  protected createWindow({ width, height, alwaysOnTop }: { width: number; height: number; alwaysOnTop: boolean }) {
    this.window = new BrowserWindow({
      ...(this.positionSetting ?? {}),
      height,
      width,
      resizable: false,
      webPreferences: {
        ...WEB_PREFERENCES,
        additionalArguments: [`--slug=${this.slug}`],
      },
      icon: path.join(__dirname, '../../build/icon.ico'),
      alwaysOnTop,
      title: this.getWindowTitle(),
    });

    // this.window.webContents.openDevTools();

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/index.html`);
    } else {
      this.window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
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
