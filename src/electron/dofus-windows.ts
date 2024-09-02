import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import { focusDofusWindow } from './dofus-windows-adapters/active';

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
