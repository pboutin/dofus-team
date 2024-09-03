import { app } from 'electron';

import BaseWindow from './_base.window';
import { GenericModel } from '../../types';
import BaseRepository from '../repositories/_base.repository';
import ConfigRepository from '../repositories/config.repository';

export default class DashboardWindow extends BaseWindow {
  protected slug = 'dashboard' as const;

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
