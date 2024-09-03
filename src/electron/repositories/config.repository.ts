import Store from 'electron-store';
import { Config } from '../../types';
import { ipcMain } from 'electron';

const STORE_KEY = 'config';

const DEFAULT_CONFIG: Config = {
  theme: 'dracula',
  alwaysOnTop: false,
};

export default class ConfigRepository {
  constructor(protected store: Store) {
    ipcMain.handle(`${this.modelName}:fetch`, () => this.fetch());
    ipcMain.handle(`${this.modelName}:update`, (_, data: Config) => this.updatePartial(data));
  }

  get modelName(): typeof STORE_KEY {
    return STORE_KEY;
  }

  onChange(callback: (config: Config) => void) {
    return this.store.onDidChange(STORE_KEY, callback);
  }

  fetch(): Config {
    return { ...DEFAULT_CONFIG, ...(this.store.get(STORE_KEY, {}) as Partial<Config>) };
  }

  update(data: Config): void {
    console.log(data);
    this.store.set(STORE_KEY, data);
  }

  updatePartial(data: Partial<Config>): void {
    this.update({ ...this.fetch(), ...data });
  }
}
