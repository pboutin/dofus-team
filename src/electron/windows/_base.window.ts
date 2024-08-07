import { BrowserWindow } from 'electron';
import settings from 'electron-settings';
import path from 'path';
import BaseRepository from '../repositories/_base.repository';
import { GenericModel } from '../common/types';
import { inject } from 'tsyringe';
import KeyboardShortcutRepository from '../repositories/keyboard-shortcut.repository';
import CharacterRepository from '../repositories/character.repository';
import TeamRepository from '../repositories/team.repository';
import { AppContext } from '../main';

export type PositionSetting = { x: number; y: number } | null;

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

const BASE_HTML_PATH = '../';

export default class BaseWindow {
  private debouncedUpdatePositionSettingsId;

  protected appContext: AppContext;
  protected window: BrowserWindow | null = null;
  protected registeredRepositories: BaseRepository<GenericModel>[];

  get slug(): string {
    throw new Error('slug not implemented');
  }

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
      alwaysOnTop,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, '../../build/icon.ico'),
    });

    this.window.loadFile(`${BASE_HTML_PATH}${htmlFile}`);
    this.window.setMenu(null);

    if (this.appContext.debug) {
      this.window.on('ready-to-show', () => {
        this.window.webContents.openDevTools({ mode: 'detach' });
      });
    }

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

    this.window.on('closed', () => (this.window = null));
  }

  private debouncedUpdatePositionSettings(position) {
    clearTimeout(this.debouncedUpdatePositionSettingsId);
    this.debouncedUpdatePositionSettingsId = setTimeout(() => {
      settings.setSync(this.positionSettingKey, position);
    }, 1000);
  }
}
