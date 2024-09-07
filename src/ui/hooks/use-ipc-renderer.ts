import { useCallback, useEffect, useState } from 'react';

import {
  GenericModel,
  Character,
  KeyboardShortcut,
  Team,
  InstantiatedCharacter,
  Config,
  DofusWindow,
} from '../../types';

const ipcRenderer = window.require('electron').ipcRenderer;

type id = string;

interface Hook<T extends GenericModel> {
  items: T[];
  itemsMap: Map<id, T>;
  upsert: (data: T) => void;
  destroy: (id: string) => void;
  duplicate: (id: string) => void;
  reorder: (ids: string[]) => void;
}

function useGenericModel<T extends GenericModel>(modelName: string): Hook<T> {
  const [items, setItems] = useState<T[]>([]);
  const [itemsMap, setItemsMap] = useState<Map<id, T>>(new Map<id, T>());

  const handleItemsChange = useCallback((_event: unknown, items: T[]) => {
    setItems(items);
    setItemsMap(new Map(items.map((item) => [item.id, item])));
  }, []);

  useEffect(() => {
    ipcRenderer.invoke(`${modelName}:fetchAll`).then((items) => handleItemsChange(null, items));

    ipcRenderer.on(`${modelName}:changed`, handleItemsChange);

    return () => {
      ipcRenderer.removeListener(`${modelName}:changed`, handleItemsChange);
    };
  }, [handleItemsChange, modelName]);

  const upsert = useCallback(
    (data: T) => {
      ipcRenderer.invoke(`${modelName}:upsert`, data);
    },
    [modelName],
  );

  const destroy = useCallback(
    (id: string) => {
      ipcRenderer.invoke(`${modelName}:destroy`, id);
    },
    [modelName],
  );

  const duplicate = useCallback(
    (id: string) => {
      ipcRenderer.invoke(`${modelName}:duplicate`, id);
    },
    [modelName],
  );

  const reorder = useCallback(
    (ids: string[]) => {
      ipcRenderer.invoke(`${modelName}:reorder`, ids);
    },
    [modelName],
  );

  return {
    items,
    itemsMap,
    upsert,
    destroy,
    duplicate,
    reorder,
  };
}

export function useCharacters() {
  return useGenericModel<Character>('Character');
}

export function useKeyboardShortcuts() {
  return useGenericModel<KeyboardShortcut>('KeyboardShortcut');
}

export function useTeams() {
  return useGenericModel<Team>('Team');
}

export function useInstantiatedCharacters() {
  const modelName = 'InstantiatedCharacter';

  const clear = useCallback(() => {
    ipcRenderer.invoke(`${modelName}:clear`);
  }, []);

  const instantiateTeam = useCallback((teamId: string) => {
    ipcRenderer.invoke(`${modelName}:instantiateTeam`, teamId);
  }, []);

  const activate = useCallback((characterId: string) => {
    ipcRenderer.invoke(`${modelName}:activate`, characterId);
  }, []);

  const activateNext = useCallback(() => {
    ipcRenderer.invoke(`${modelName}:activateNext`);
  }, []);

  const activatePrevious = useCallback(() => {
    ipcRenderer.invoke(`${modelName}:activatePrevious`);
  }, []);

  return {
    ...useGenericModel<InstantiatedCharacter>(modelName),
    clear,
    instantiateTeam,
    activate,
    activateNext,
    activatePrevious,
  };
}

export function useOpenSettingsWindow() {
  const openSettingsWindow = useCallback(() => {
    ipcRenderer.invoke('openSettingsWindow');
  }, []);

  return openSettingsWindow;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);

  const handleConfigChange = useCallback((_event: unknown, config: Config) => {
    setConfig(config);
    document.body.dataset.theme = config.theme;
  }, []);

  useEffect(() => {
    ipcRenderer.invoke('Config:fetch').then((config) => handleConfigChange(null, config));

    ipcRenderer.on('Config:changed', handleConfigChange);

    return () => {
      ipcRenderer.removeListener('Config:changed', handleConfigChange);
    };
  }, [handleConfigChange]);

  const updateTheme = useCallback((theme: string) => {
    ipcRenderer.invoke('Config:update', { theme });
  }, []);

  const updateAlwaysOnTop = useCallback((alwaysOnTop: boolean) => {
    ipcRenderer.invoke('Config:update', { alwaysOnTop });
  }, []);

  return { ...config, isReady: !!config, updateTheme, updateAlwaysOnTop };
}

export function useDofusWindows() {
  const [dofusWindows, setDofusWindows] = useState<DofusWindow[]>([]);

  useEffect(() => {
    ipcRenderer.invoke('dofusWindows:fetchAll').then(setDofusWindows);
  }, []);

  return dofusWindows;
}
