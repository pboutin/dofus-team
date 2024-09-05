import { ipcMain } from 'electron';

import { Config } from '../../types';
import Store from '../store';

const DEFAULT_CONFIG: Config = {
  theme: 'dracula',
  alwaysOnTop: false,
};

export default class ConfigRepository {
  protected store = new Store<Partial<Config>>('Config', DEFAULT_CONFIG);

  constructor() {
    ipcMain.handle(`Config:fetch`, () => this.fetch());
    ipcMain.handle(`Config:update`, (_, data: Config) => this.updatePartial(data));
  }

  onChange(callback: (config: Config) => void) {
    return this.store.onDidChange(callback);
  }

  fetch(): Config {
    return { ...DEFAULT_CONFIG, ...this.store.get() };
  }

  update(data: Config): void {
    this.store.set(data);
  }

  updatePartial(data: Partial<Config>): void {
    this.update({ ...this.fetch(), ...data });
  }
}
