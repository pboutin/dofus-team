import { globalShortcut } from 'electron';

import { Action, KeyboardShortcut } from '../common/types';
import { Repositories } from './store';

interface Context {
  repositories: Repositories;
  instanciateTeam: (teamId: string) => void;
}

export const initializeKeyboard = ({ repositories, instanciateTeam }: Context) => {
  const keyboardShortcuts = repositories.keyboardShortcuts.fetchAll();

  registerKeyboardShortcuts(keyboardShortcuts, repositories, instanciateTeam);

  repositories.keyboardShortcuts.onChange((keyboardShortcuts) =>
    registerKeyboardShortcuts(keyboardShortcuts, repositories, instanciateTeam),
  );
};

const registerKeyboardShortcuts = (
  keyboardShortcuts: KeyboardShortcut[],
  repositories: Repositories,
  instanciateTeam: (teamId: string) => void,
) => {
  globalShortcut.unregisterAll();

  keyboardShortcuts.forEach((keyboardShortcut) => {
    globalShortcut.register(keyboardShortcut.keybind, () => {
      switch (keyboardShortcut.action) {
        case Action.GOTO_NEXT:
          repositories.instanciatedCharacters.activateNext();
          break;
        case Action.GOTO_PREVIOUS:
          repositories.instanciatedCharacters.activatePrevious();
          break;
        case Action.GOTO_1:
        case Action.GOTO_2:
        case Action.GOTO_3:
        case Action.GOTO_4:
        case Action.GOTO_5:
        case Action.GOTO_6:
        case Action.GOTO_7:
        case Action.GOTO_8:
          repositories.instanciatedCharacters.activateAt(
            parseInt(keyboardShortcut.action.replace('GOTO_', ''), 10) - 1,
          );
          break;
        case Action.GOTO_CHARACTER:
          repositories.instanciatedCharacters.activate(keyboardShortcut.argument);
          break;
        case Action.SWITCH_TEAM:
          instanciateTeam(keyboardShortcut.argument);
          break;
        default:
          throw new Error(`Unknown action ${keyboardShortcut.action}`);
      }
    });
  });
};
