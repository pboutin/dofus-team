import { globalShortcut } from 'electron';

import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import KeyboardShortcutRepository from './repositories/keyboard-shortcut.repository';
import { Action, KeyboardShortcut } from '../types';

export default class KeyboardShortcuts {
  constructor(
    private instantiatedCharacterRepository: InstantiatedCharacterRepository,
    private keyboardShortcutRepository: KeyboardShortcutRepository,
  ) {
    this.registerKeyboardShortcuts(this.keyboardShortcutRepository.fetchAll());

    this.keyboardShortcutRepository.onChange((keyboardShortcuts) => {
      this.registerKeyboardShortcuts(keyboardShortcuts);
    });
  }

  private registerKeyboardShortcuts(keyboardShortcuts: KeyboardShortcut[]) {
    globalShortcut.unregisterAll();

    keyboardShortcuts.forEach((keyboardShortcut) => {
      globalShortcut.register(keyboardShortcut.keybind, () => {
        switch (keyboardShortcut.action) {
          case Action.GOTO_NEXT:
            this.instantiatedCharacterRepository.activateNext();
            break;
          case Action.GOTO_PREVIOUS:
            this.instantiatedCharacterRepository.activatePrevious();
            break;
          case Action.GOTO_1:
          case Action.GOTO_2:
          case Action.GOTO_3:
          case Action.GOTO_4:
          case Action.GOTO_5:
          case Action.GOTO_6:
          case Action.GOTO_7:
          case Action.GOTO_8:
            this.instantiatedCharacterRepository.activateAt(
              parseInt(keyboardShortcut.action.replace('GOTO_', ''), 10) - 1,
            );
            break;
          case Action.GOTO_CHARACTER:
            this.instantiatedCharacterRepository.activate(keyboardShortcut.argument);
            break;
          case Action.SWITCH_TEAM:
            this.instantiatedCharacterRepository.instantiateTeam(keyboardShortcut.argument);
            break;
          default:
            throw new Error(`Unknown action ${keyboardShortcut.action}`);
        }
      });
    });
  }
}
