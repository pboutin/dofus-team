import { app } from 'electron';
import BaseWindow from './_base.window';
import BaseRepository from 'src/electron/repositories/_base.repository';
import { GenericModel } from 'src/types';

export default class DashboardWindow extends BaseWindow {
  constructor(protected registeredRepositories: BaseRepository<GenericModel>[]) {
    super();
  }

  get slug() {
    return 'dashboard';
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      htmlFile: 'dashboard.html',
      height: 620,
      width: 475,
    });

    this.window.on('close', () => app.quit());
  }
}
