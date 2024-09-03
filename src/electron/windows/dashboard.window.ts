import { app } from 'electron';
import BaseWindow from './_base.window';
import BaseRepository from '../repositories/_base.repository';
import { GenericModel } from '../../types';
import ConfigRepository from '../repositories/config.repository';
import { config } from 'koffi';

export default class DashboardWindow extends BaseWindow {
  protected slug: 'dashboard' = 'dashboard';

  constructor(
    protected modelRepositories: Array<BaseRepository<GenericModel>>,
    protected configRepository: ConfigRepository,
  ) {
    super();

    this.configRepository.onChange(({ alwaysOnTop }) => {
      this.window?.setAlwaysOnTop(alwaysOnTop);
    });
  }

  open() {
    const { alwaysOnTop } = this.configRepository.fetch();

    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      height: 665,
      width: 475,
      alwaysOnTop,
    });

    this.window.on('close', () => app.quit());
  }
}
