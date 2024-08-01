import { Character, InstantiatedCharacter } from '../common/types';
import BaseRepository from './base.repository';

export default class InstantiatedCharacterRepository extends BaseRepository<InstantiatedCharacter> {
  get modelName() {
    return 'InstantiatedCharacter';
  }

  destroy(id: string): void {
    const destroyingCharacter = this.fetchById(id);

    super.destroy(id);

    if (destroyingCharacter.active) {
      this.activateNext();
    }
  }

  onActiveCharacterChange(callback: (character: InstantiatedCharacter) => void) {
    this.store.onDidChange(
      this.modelName,
      (characters: InstantiatedCharacter[], previousCharacters?: InstantiatedCharacter[]) => {
        const activeCharacter = characters.find((character) => character.active);
        const previousActiveCharacter = previousCharacters?.find((character) => character.active);

        if (!activeCharacter || activeCharacter.id === previousActiveCharacter?.id) return;

        callback(activeCharacter);
      },
    );
  }

  clear() {
    this.store.set(this.modelName, []);
  }

  instantiateCharacters(characters: Character[]) {
    const instantiatedCharacters: InstantiatedCharacter[] = characters.map((character, index) => ({
      ...character,
      active: index === 0,
      disabled: false,
    }));

    this.store.set(this.modelName, instantiatedCharacters);
  }

  activate(id: string) {
    const characters = this.fetchAll();

    const updatedCharacters = characters.map((character) => ({
      ...character,
      active: character.id === id,
    }));

    this.store.set(this.modelName, updatedCharacters);
  }

  activateAt(index: number) {
    const characters = this.fetchAll();

    if (index >= characters.length) {
      return;
    }

    this.activate(characters[index].id);
  }

  activateNext() {
    const characters = this.fetchAll();

    if (characters.length === 0) {
      return;
    }

    let activeCharacterIndex = characters.findIndex((character) => character.active);

    if (activeCharacterIndex === -1) {
      if (!characters[0].disabled) {
        this.activateAt(0);
        return;
      } else {
        activeCharacterIndex = 0;
      }
    }

    let nextCharacterIndex = activeCharacterIndex;

    do {
      nextCharacterIndex++;

      if (nextCharacterIndex >= characters.length) {
        nextCharacterIndex = 0;
      }
    } while (characters[nextCharacterIndex].disabled && nextCharacterIndex !== activeCharacterIndex);

    this.activateAt(nextCharacterIndex);
  }

  activatePrevious() {
    const characters = this.fetchAll();

    if (characters.length === 0) {
      return;
    }

    const activeCharacterIndex = characters.findIndex((character) => character.active);

    if (activeCharacterIndex === -1) {
      return this.activateNext();
    }

    let previousCharacterIndex = activeCharacterIndex;

    do {
      previousCharacterIndex--;

      if (previousCharacterIndex < 0) {
        previousCharacterIndex = characters.length - 1;
      }
    } while (characters[previousCharacterIndex].disabled && previousCharacterIndex !== activeCharacterIndex);

    this.activateAt(previousCharacterIndex);
  }
}
