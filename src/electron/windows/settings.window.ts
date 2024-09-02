import BaseWindow from './_base.window';
import BaseRepository from 'src/electron/repositories/_base.repository';
import { GenericModel } from 'src/types';

export default class SettingsWindow extends BaseWindow {
  constructor(protected registeredRepositories: BaseRepository<GenericModel>[]) {
    super();
  }

  get slug() {
    return 'settings';
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      htmlFile: 'settings.html',
      width: 800,
      height: 600,
    });
  }
}
