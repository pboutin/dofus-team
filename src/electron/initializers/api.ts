import { ipcMain } from "electron";

import { Repositories } from "./store";

interface Context {
  repositories: Repositories;
  instanciateTeam: (teamId: string) => void;
}

export const initializeApi = ({ repositories, instanciateTeam }: Context) => {
  Object.values(repositories).forEach((repository) => {
    ipcMain.handle(`${repository.modelName}:fetchAll`, () =>
      repository.fetchAll()
    );

    ipcMain.handle(`${repository.modelName}:upsert`, (_, data: any) =>
      repository.upsert(data)
    );

    ipcMain.handle(`${repository.modelName}:destroy`, (_, id: string) =>
      repository.destroy(id)
    );

    ipcMain.handle(`${repository.modelName}:duplicate`, (_, id: string) =>
      repository.duplicate(id)
    );

    ipcMain.handle(`${repository.modelName}:reorder`, (_, ids: string[]) =>
      repository.reorder(ids)
    );
  });

  ipcMain.handle(
    `${repositories.instanciatedCharacters.modelName}:instanciateTeam`,
    (_, teamId: string) => {
      instanciateTeam(teamId);
    }
  );

  ipcMain.handle(
    `${repositories.instanciatedCharacters.modelName}:activate`,
    (_, characterId: string) => {
      repositories.instanciatedCharacters.activate(characterId);
    }
  );

  ipcMain.handle(
    `${repositories.instanciatedCharacters.modelName}:activateNext`,
    () => {
      repositories.instanciatedCharacters.activateNext();
    }
  );

  ipcMain.handle(
    `${repositories.instanciatedCharacters.modelName}:activatePrevious`,
    () => {
      repositories.instanciatedCharacters.activatePrevious();
    }
  );

  const subscribeWindow = (window: Electron.BrowserWindow) => {
    Object.values(repositories).forEach((repository) => {
      repository.onChange((items) => {
        window.webContents.send(`${repository.modelName}:changed`, items);
      });
    });
  };

  return {
    subscribeWindow,
  };
};
