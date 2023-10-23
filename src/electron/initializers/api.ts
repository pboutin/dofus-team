import { ipcMain } from "electron";

import { Repositories } from "./store";
import { fetch as characterDirectoryFetch } from "../services/character-directory.service";
import { Server } from "../common/types";

interface Context {
  repositories: Repositories;
}

export const initializeApi = ({ repositories }: Context) => {
  Object.values(repositories).forEach((repository) => {
    ipcMain.handle(`${repository.modelName}:fetchAll`, () =>
      repository.fetchAll()
    );

    ipcMain.handle(`${repository.modelName}:upsert`, (_, data: never) =>
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
    "character-directory:fetch",
    async (_, name: string, server: Server) => {
      const character = await characterDirectoryFetch(name, server);
      return character;
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
