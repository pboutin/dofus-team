import { exec } from 'child_process';

import { Repositories } from './store';

interface Context {
  debug: boolean;
  repositories: Repositories;
}

export const initializeDofusWindows = ({ repositories, debug }: Context) => {
  repositories.instanciatedCharacters.onActiveCharacterChange((character) => {
    const windowName = `"${character.name} - Dofus"`;
    console.log('Switching to window: ', windowName);
    if (!debug) exec(`windows_activate.vbs ${windowName}`);
  });
};
