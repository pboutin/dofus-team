import { inject, singleton } from 'tsyringe';
import BaseWindow from './_base.window';
import CharacterRepository from '../repositories/character.repository';
import KeyboardShortcutRepository from '../repositories/keyboard-shortcut.repository';
import TeamRepository from '../repositories/team.repository';
import InstantiatedCharacterRepository from '../repositories/instantiated-character.repository';

@singleton()
export default class SettingsWindow extends BaseWindow {
  constructor(
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
    return 'settings';
  }

  open() {
    if (this.window) {
      this.window.show();
    }

    this.createWindow({
      htmlFile: 'settings.html',
      width: 800,
      height: 600,
      alwaysOnTop: false,
    });
  }
}
