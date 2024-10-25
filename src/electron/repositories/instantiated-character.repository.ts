import { ipcMain } from 'electron';

import BaseRepository from './_base.repository';
import CharacterRepository from './character.repository';
import TeamRepository from './team.repository';
import { InstantiatedCharacter } from '../../types';

export default class InstantiatedCharacterRepository extends BaseRepository<InstantiatedCharacter> {
  private activeSubscribers: Array<(character: InstantiatedCharacter) => void> = [];

  constructor(
    private teamRepository: TeamRepository,
    private characterRepository: CharacterRepository,
  ) {
    super();

    ipcMain.handle(`${this.modelName}:instantiateTeam`, (_, teamId: string) => {
      this.instantiateTeam(teamId);
    });

    ipcMain.handle(`${this.modelName}:clear`, () => {
      this.clear();
    });

    ipcMain.handle(`${this.modelName}:activate`, (_, characterId: string) => {
      this.activate(characterId);
    });

    ipcMain.handle(`${this.modelName}:activateNext`, () => {
      this.activateNext();
    });

    ipcMain.handle(`${this.modelName}:activatePrevious`, () => {
      this.activatePrevious();
    });
  }

  get modelName() {
    return 'InstantiatedCharacter';
  }

  get defaultValues() {
    return {
      server: 'Imagiro'
    };
  }

  instantiateTeam(teamId: string) {
    const team = this.teamRepository.fetchById(teamId);
    if (!team) return;

    const characters = this.characterRepository.fetchByIds(team.characterIds);

    const instantiatedCharacters: InstantiatedCharacter[] = characters.map((character, index) => ({
      ...character,
      active: index === 0,
      disabled: false,
    }));

    this.store.set(instantiatedCharacters);
  }

  destroy(id: string): void {
    const destroyingCharacter = this.fetchById(id);

    super.destroy(id);

    if (destroyingCharacter.active) {
      this.activateNext();
    }
  }

  onActiveCharacterChange(callback: (character: InstantiatedCharacter) => void) {
    this.activeSubscribers.push(callback);

    return () => {
      this.activeSubscribers = this.activeSubscribers.filter(
        (subscriptionCallback) => subscriptionCallback !== callback,
      );
    };
  }

  clear() {
    this.store.set([]);
  }

  activate(id: string) {
    const characters = this.fetchAll();
    let activeCharacter: InstantiatedCharacter | null = null;

    const updatedCharacters = characters.map((character) => {
      const updatedCharacter = {
        ...character,
        active: character.id === id,
      };

      if (updatedCharacter.active) {
        activeCharacter = updatedCharacter;
      }

      return updatedCharacter;
    });

    this.store.set(updatedCharacters);

    if (!activeCharacter) return;
    this.activeSubscribers.forEach((callback) => callback(activeCharacter));
  }

  activateByName(characterName: string) {
    const instanciatedCharacter = this.fetchAll().find(({name}) => name === characterName);
    if (!instanciatedCharacter) return;

    this.activate(instanciatedCharacter.id);
  }

  activateAt(index: number) {
    if (index < 0) return;

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
