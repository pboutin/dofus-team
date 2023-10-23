import { globalShortcut } from "electron";

import { KeyboardShortcut } from "../common/types";
import { Repositories, RepositoriesService } from "./store";

interface Context {
  repositories: Repositories;
  repositoriesService: RepositoriesService;
}

export const initializeKeyboard = ({
  repositories,
  repositoriesService,
}: Context) => {
  const keyboardShortcuts = repositories.keyboardShortcuts.fetchAll();

  registerKeyboardShortcuts(
    keyboardShortcuts,
    repositories,
    repositoriesService
  );

  repositories.keyboardShortcuts.onChange((keyboardShortcuts) =>
    registerKeyboardShortcuts(
      keyboardShortcuts,
      repositories,
      repositoriesService
    )
  );
};

const registerKeyboardShortcuts = (
  keyboardShortcuts: KeyboardShortcut[],
  repositories: Repositories,
  repositoriesService: RepositoriesService
) => {
  globalShortcut.unregisterAll();

  keyboardShortcuts.forEach((keyboardShortcut) => {
    globalShortcut.register(keyboardShortcut.keybind, () => {
      switch (keyboardShortcut.action) {
        case "GOTO_NEXT":
          repositories.instanciatedCharacters.activateNext();
          break;
        case "GOTO_PREVIOUS":
          repositories.instanciatedCharacters.activatePrevious();
          break;
        case "GOTO_1":
        case "GOTO_2":
        case "GOTO_3":
        case "GOTO_4":
        case "GOTO_5":
        case "GOTO_6":
        case "GOTO_7":
        case "GOTO_8":
          repositories.instanciatedCharacters.activateAt(
            parseInt(keyboardShortcut.action.replace("GOTO_", ""), 10) - 1
          );
          break;
        case "GOTO_CHARACTER":
          if (!keyboardShortcut.argument) return;
          repositories.instanciatedCharacters.activate(
            keyboardShortcut.argument
          );
          break;
        case "SWITCH_TEAM":
          if (!keyboardShortcut.argument) return;
          repositoriesService.instanciateTeam(keyboardShortcut.argument);
          break;
      }
    });
  });
};
