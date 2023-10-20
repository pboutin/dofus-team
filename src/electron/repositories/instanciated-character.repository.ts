import { Character, InstanciatedCharacter } from "../common/types";
import BaseRepository from "./base.repository";

export default class InstanciatedCharacterRepository extends BaseRepository<InstanciatedCharacter> {
  get modelName() {
    return "InstanciatedCharacter";
  }

  onActiveCharacterChange(
    callback: (character: InstanciatedCharacter) => void
  ) {
    this.store.onDidChange(
      this.modelName,
      (
        characters: InstanciatedCharacter[],
        previousCharacters?: InstanciatedCharacter[]
      ) => {
        const activeCharacter = characters.find(
          (character) => character.active
        );
        const previousActiveCharacter = previousCharacters?.find(
          (character) => character.active
        );

        if (
          !activeCharacter ||
          activeCharacter.id === previousActiveCharacter?.id
        )
          return;

        callback(activeCharacter);
      }
    );
  }

  instanciateCharacters(characters: Character[]) {
    const instanciatedCharacters: InstanciatedCharacter[] = characters.map(
      (character, index) => ({
        ...character,
        active: index === 0,
        disabled: false,
      })
    );

    this.store.set(this.modelName, instanciatedCharacters);
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

    const activeCharacterIndex = characters.findIndex(
      (character) => character.active
    );

    if (activeCharacterIndex === -1) {
      return;
    }

    const nextCharacterIndex = activeCharacterIndex + 1;

    if (nextCharacterIndex >= characters.length) {
      return this.activateAt(0);
    }

    this.activateAt(nextCharacterIndex);
  }

  activatePrevious() {
    const characters = this.fetchAll();

    const activeCharacterIndex = characters.findIndex(
      (character) => character.active
    );

    if (activeCharacterIndex === -1) {
      return;
    }

    const previousCharacterIndex = activeCharacterIndex - 1;

    if (previousCharacterIndex < 0) {
      return this.activateAt(characters.length - 1);
    }

    this.activateAt(previousCharacterIndex);
  }
}
