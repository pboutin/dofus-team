import path from 'path';

import { BrowserWindow } from 'electron';

import packageJson from '../../../package.json';
import translations from '../../translations';
import { GenericModel, WindowPosition } from '../../types';
import BaseRepository from '../repositories/_base.repository';
import ConfigRepository from '../repositories/config.repository';

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

export default class BaseWindow {
  private debouncedUpdatePositionSettingsId: NodeJS.Timeout;

  protected slug: 'dashboard' | 'settings';
  protected window: BrowserWindow | null = null;
  protected modelRepositories: Array<BaseRepository<GenericModel>>;
  protected configRepository: ConfigRepository;

  private get configWindowPosition() {
    const config = this.configRepository.fetch();
    return config[`${this.slug}WindowPosition`];
  }

  protected createWindow({ width, height, alwaysOnTop }: { width: number; height: number; alwaysOnTop: boolean }) {
    this.window = new BrowserWindow({
      ...(this.configWindowPosition ?? {}),
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

    this.modelRepositories.forEach((repository) => {
      const unsubscribe = repository.onChange((items) => {
        if (this.window.isDestroyed()) return;
        this.window.webContents.send(`${repository.modelName}:changed`, items);
      });

      this.window.on('closed', unsubscribe);
    });

    const unsubscribeConfig = this.configRepository.onChange((config) => {
      if (this.window.isDestroyed()) return;
      this.window.webContents.send('config:changed', config);
    });
    this.window.on('closed', unsubscribeConfig);

    this.window.on('closed', (): void => (this.window = null));
  }

  private debouncedUpdatePositionSettings(position: WindowPosition) {
    clearTimeout(this.debouncedUpdatePositionSettingsId);
    this.debouncedUpdatePositionSettingsId = setTimeout(() => {
      this.configRepository.updatePartial({
        [`${this.slug}WindowPosition`]: position,
      });
    }, 2000);
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
