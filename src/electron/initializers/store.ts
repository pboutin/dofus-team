import Store from 'electron-store';

import CharacterRepository from '../repositories/character.repository';
import KeyboardShortcutRepository from '../repositories/keyboard-shortcut.repository';
import TeamRepository from '../repositories/team.repository';
import InstantiatedCharacterRepository from '../repositories/instantiated-character.repository';

export type Repositories = {
  characters: CharacterRepository;
  instantiatedCharacters: InstantiatedCharacterRepository;
  keyboardShortcuts: KeyboardShortcutRepository;
  teams: TeamRepository;
};

export type Repository =
  | CharacterRepository
  | KeyboardShortcutRepository
  | TeamRepository
  | InstantiatedCharacterRepository;

interface Context {
  debug: boolean;
}

export const initializeStore = ({ debug }: Context) => {
  const repositories: Repositories = {
    characters: new CharacterRepository(),
    keyboardShortcuts: new KeyboardShortcutRepository(),
    teams: new TeamRepository(),
    instantiatedCharacters: new InstantiatedCharacterRepository(),
  };

  const store = new Store({
    schema: Object.values<Repository>(repositories).reduce(
      (schema, repository) => ({
        ...schema,
        [repository.modelName]: {
          type: 'array',
          default: [],
        },
      }),
      {},
    ),
  });

  if (debug) {
    console.log('Store initialized with:');
    console.log(JSON.stringify(store.store, null, 2));
  }

  Object.values(repositories).forEach((repository) => {
    repository.registerStore(store);
  });

  const instantiateTeam = (teamId: string) => {
    const team = repositories.teams.fetchById(teamId);
    if (!team) return;

    const characters = repositories.characters.fetchByIds(team.characterIds);
    repositories.instantiatedCharacters.instantiateCharacters(characters);
  };

  const hardReset = () => {
    store.clear();
  };

  return { repositories, instantiateTeam: instantiateTeam, hardReset };
};
