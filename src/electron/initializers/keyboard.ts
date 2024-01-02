import { globalShortcut } from 'electron';

import { KeyboardShortcut } from '../common/types';
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
        case 'GOTO_NEXT':
          repositories.instanciatedCharacters.activateNext();
          break;
        case 'GOTO_PREVIOUS':
          repositories.instanciatedCharacters.activatePrevious();
          break;
        case 'GOTO_1':
        case 'GOTO_2':
        case 'GOTO_3':
        case 'GOTO_4':
        case 'GOTO_5':
        case 'GOTO_6':
        case 'GOTO_7':
        case 'GOTO_8':
          repositories.instanciatedCharacters.activateAt(
            parseInt(keyboardShortcut.action.replace('GOTO_', ''), 10) - 1,
          );
          break;
        case 'GOTO_CHARACTER':
          repositories.instanciatedCharacters.activate(keyboardShortcut.argument);
          break;
        case 'SWITCH_TEAM':
          instanciateTeam(keyboardShortcut.argument);
          break;
      }
    });
  });
};
