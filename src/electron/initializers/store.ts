import Store from "electron-store";

import CharacterRepository from "../repositories/character.repository";
import KeyboardShortcutRepository from "../repositories/keyboard-shortcut.repository";
import TeamRepository from "../repositories/team.repository";
import InstanciatedCharacterRepository from "../repositories/instanciated-character.repository";

export type Repositories = {
  characters: CharacterRepository;
  instanciatedCharacters: InstanciatedCharacterRepository;
  keyboardShortcuts: KeyboardShortcutRepository;
  teams: TeamRepository;
};

export interface RepositoriesService {
  instanciateTeam: (teamId: string) => void;
}

export type Repository =
  | CharacterRepository
  | KeyboardShortcutRepository
  | TeamRepository
  | InstanciatedCharacterRepository;

interface Context {
  debug: boolean;
}

export const initializeStore = ({ debug }: Context) => {
  const repositories: Repositories = {
    characters: new CharacterRepository(),
    keyboardShortcuts: new KeyboardShortcutRepository(),
    teams: new TeamRepository(),
    instanciatedCharacters: new InstanciatedCharacterRepository(),
  };

  const store = new Store({
    schema: Object.values<Repository>(repositories).reduce(
      (schema, repository) => ({
        ...schema,
        [repository.modelName]: {
          type: "array",
          default: [],
        },
      }),
      {}
    ),
  });

  if (debug) {
    console.log("Store initialized with:");
    console.log(JSON.stringify(store.store, null, 2));
  }

  Object.values(repositories).forEach((repository) => {
    repository.registerStore(store);
  });

  const repositoriesService: RepositoriesService = {
    instanciateTeam: (teamId: string) => {
      const team = repositories.teams.fetchById(teamId);
      if (!team) return;

      const characters = repositories.characters.fetchByIds(team.characterIds);
      repositories.instanciatedCharacters.instanciateCharacters(characters);
    },
  };

  return { repositories, repositoriesService };
};
