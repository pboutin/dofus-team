import { ipcMain } from 'electron';
import Store from 'electron-store';
import { inject, singleton } from 'tsyringe';
import { InstantiatedCharacter } from '../../types';
import BaseRepository from './_base.repository';
import CharacterRepository from './character.repository';
import TeamRepository from './team.repository';

@singleton()
export default class InstantiatedCharacterRepository extends BaseRepository<InstantiatedCharacter> {
  constructor(
    @inject('store') protected store: Store,
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

  instantiateTeam(teamId: string) {
    const team = this.teamRepository.fetchById(teamId);
    if (!team) return;

    const characters = this.characterRepository.fetchByIds(team.characterIds);

    const instantiatedCharacters: InstantiatedCharacter[] = characters.map((character, index) => ({
      ...character,
      active: index === 0,
      disabled: false,
    }));

    this.store.set(this.modelName, instantiatedCharacters);
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
