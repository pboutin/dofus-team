import { inject, singleton } from 'tsyringe';
import settings from 'electron-settings';
import BaseWindow from './_base.window';
import CharacterRepository from '../repositories/character.repository';
import KeyboardShortcutRepository from '../repositories/keyboard-shortcut.repository';
import TeamRepository from '../repositories/team.repository';
import InstantiatedCharacterRepository from '../repositories/instantiated-character.repository';
import { AppContext } from '../main';

@singleton()
export default class DashboardWindow extends BaseWindow {
  constructor(
    @inject('appContext') protected appContext: AppContext,
    private characterRepository: CharacterRepository,
    private teamRepository: TeamRepository,
    private keyboardShortcutRepository: KeyboardShortcutRepository,
    private instantiatedCharacterRepository: InstantiatedCharacterRepository,
  ) {
    super();

    this.registeredRepositories = [
      characterRepository,
      teamRepository,
      keyboardShortcutRepository,
      instantiatedCharacterRepository,
    ];
  }

  get slug() {
    return 'dashboard';
  }

  get alwaysOnTopSettingKey() {
    return `${this.slug}:alwaysOnTop`;
  }

  get alwaysOnTopSetting() {
    return settings.getSync(this.alwaysOnTopSettingKey) as boolean;
  }

  toggleAlwaysOnTop() {
    const currentValue = this.alwaysOnTopSetting;

    settings.setSync(this.alwaysOnTopSettingKey, !currentValue);
    this.window?.setAlwaysOnTop(!currentValue);
  }

  open() {
    if (this.window) {
      this.window.show();
    }

    this.createWindow({
      htmlFile: 'dashboard.html',
      height: 620,
      width: 475,
      alwaysOnTop: this.alwaysOnTopSetting,
    });
  }
}
