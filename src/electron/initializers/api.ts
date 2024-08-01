import { ipcMain } from 'electron';

import { Repositories } from './store';

interface Context {
  repositories: Repositories;
  instantiateTeam: (teamId: string) => void;
}

export const initializeApi = ({ repositories, instantiateTeam }: Context) => {
  Object.values(repositories).forEach((repository) => {
    ipcMain.handle(`${repository.modelName}:fetchAll`, () => repository.fetchAll());

    ipcMain.handle(`${repository.modelName}:upsert`, (_, data: any) => repository.upsert(data));

    ipcMain.handle(`${repository.modelName}:destroy`, (_, id: string) => repository.destroy(id));

    ipcMain.handle(`${repository.modelName}:duplicate`, (_, id: string) => repository.duplicate(id));

    ipcMain.handle(`${repository.modelName}:reorder`, (_, ids: string[]) => repository.reorder(ids));
  });

  ipcMain.handle(`${repositories.instantiatedCharacters.modelName}:instantiateTeam`, (_, teamId: string) => {
    instantiateTeam(teamId);
  });

  ipcMain.handle(`${repositories.instantiatedCharacters.modelName}:clear`, (_, characterId: string) => {
    repositories.instantiatedCharacters.clear();
  });

  ipcMain.handle(`${repositories.instantiatedCharacters.modelName}:activate`, (_, characterId: string) => {
    repositories.instantiatedCharacters.activate(characterId);
  });

  ipcMain.handle(`${repositories.instantiatedCharacters.modelName}:activateNext`, () => {
    repositories.instantiatedCharacters.activateNext();
  });

  ipcMain.handle(`${repositories.instantiatedCharacters.modelName}:activatePrevious`, () => {
    repositories.instantiatedCharacters.activatePrevious();
  });

  const subscribeWindow = (window: Electron.BrowserWindow) => {
    Object.values(repositories).forEach((repository) => {
      repository.onChange((items) => {
        if (window.isDestroyed()) return;
        window.webContents.send(`${repository.modelName}:changed`, items);
      });
    });
  };

  return {
    subscribeWindow,
  };
};
