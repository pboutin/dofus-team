import { globalShortcut } from 'electron';

import { Action, KeyboardShortcut } from '../common/types';
import { Repositories } from './store';

interface Context {
  repositories: Repositories;
  instantiateTeam: (teamId: string) => void;
}

export const initializeKeyboard = ({ repositories, instantiateTeam }: Context) => {
  const keyboardShortcuts = repositories.keyboardShortcuts.fetchAll();

  registerKeyboardShortcuts(keyboardShortcuts, repositories, instantiateTeam);

  repositories.keyboardShortcuts.onChange((keyboardShortcuts) =>
    registerKeyboardShortcuts(keyboardShortcuts, repositories, instantiateTeam),
  );
};

const registerKeyboardShortcuts = (
  keyboardShortcuts: KeyboardShortcut[],
  repositories: Repositories,
  instantiateTeam: (teamId: string) => void,
) => {
  globalShortcut.unregisterAll();

  keyboardShortcuts.forEach((keyboardShortcut) => {
    globalShortcut.register(keyboardShortcut.keybind, () => {
      switch (keyboardShortcut.action) {
        case Action.GOTO_NEXT:
          repositories.instantiatedCharacters.activateNext();
          break;
        case Action.GOTO_PREVIOUS:
          repositories.instantiatedCharacters.activatePrevious();
          break;
        case Action.GOTO_1:
        case Action.GOTO_2:
        case Action.GOTO_3:
        case Action.GOTO_4:
        case Action.GOTO_5:
        case Action.GOTO_6:
        case Action.GOTO_7:
        case Action.GOTO_8:
          repositories.instantiatedCharacters.activateAt(
            parseInt(keyboardShortcut.action.replace('GOTO_', ''), 10) - 1,
          );
          break;
        case Action.GOTO_CHARACTER:
          repositories.instantiatedCharacters.activate(keyboardShortcut.argument);
          break;
        case Action.SWITCH_TEAM:
          instantiateTeam(keyboardShortcut.argument);
          break;
        default:
          throw new Error(`Unknown action ${keyboardShortcut.action}`);
      }
    });
  });
};
