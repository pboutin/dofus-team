import { singleton } from 'tsyringe';
import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import { focusDofusWindow } from './dofus-windows-adapters/active';

@singleton()
export default class DofusWindows {
  constructor(private instantiatedCharacterRepository: InstantiatedCharacterRepository) {
    this.instantiatedCharacterRepository.onActiveCharacterChange((character) => {
      this.focus(character.name);
    });
  }

  focus(characterName: string) {
    focusDofusWindow(characterName);
  }
}
