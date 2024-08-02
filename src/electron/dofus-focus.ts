import { inject, singleton } from 'tsyringe';
import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import { exec } from 'child_process';
import { AppContext } from './main';

@singleton()
export default class DofusFocus {
  constructor(
    @inject('appContext') private appContext: AppContext,
    private instantiatedCharacterRepository: InstantiatedCharacterRepository,
  ) {
    instantiatedCharacterRepository.onActiveCharacterChange((character) => {
      this.focus(character.name);
    });
  }

  focus(characterName: string) {
    const windowName = `"${characterName} - Dofus"`;
    console.log('Switching to window: ', windowName);

    if (this.appContext.debug) return;

    exec(`windows_activate.vbs ${windowName}`);
  }
}
