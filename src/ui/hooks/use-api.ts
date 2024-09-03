import { useCallback, useEffect, useState } from 'react';

import { GenericModel, Character, KeyboardShortcut, Team, InstantiatedCharacter, Config } from '../../types';

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

function useApi<T extends GenericModel>(modelName: string): Hook<T> {
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

  return {
    items,
    itemsMap,
    upsert: (data: T) => {
      ipcRenderer.invoke(`${modelName}:upsert`, data);
    },
    destroy: (id: string) => {
      ipcRenderer.invoke(`${modelName}:destroy`, id);
    },
    duplicate: (id: string) => {
      ipcRenderer.invoke(`${modelName}:duplicate`, id);
    },
    reorder: (ids: string[]) => {
      ipcRenderer.invoke(`${modelName}:reorder`, ids);
    },
  };
}

export function useCharacters() {
  return useApi<Character>('Character');
}

export function useKeyboardShortcuts() {
  return useApi<KeyboardShortcut>('KeyboardShortcut');
}

export function useTeams() {
  return useApi<Team>('Team');
}

export function useInstantiatedCharacters() {
  const modelName = 'InstantiatedCharacter';
  return {
    ...useApi<InstantiatedCharacter>(modelName),
    clear: () => {
      ipcRenderer.invoke(`${modelName}:clear`);
    },
    instantiateTeam: (teamId: string) => {
      ipcRenderer.invoke(`${modelName}:instantiateTeam`, teamId);
    },
    activate: (characterId: string) => {
      ipcRenderer.invoke(`${modelName}:activate`, characterId);
    },
    activateNext: () => {
      ipcRenderer.invoke(`${modelName}:activateNext`);
    },
    activatePrevious: () => {
      ipcRenderer.invoke(`${modelName}:activatePrevious`);
    },
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

  const handleConfigChange = (_event: unknown, config: Config) => {
    setConfig(config);
    document.body.dataset.theme = config.theme;
  };

  useEffect(() => {
    ipcRenderer.invoke('config:fetch').then((config) => handleConfigChange(null, config));

    ipcRenderer.on('config:changed', handleConfigChange);

    return () => {
      ipcRenderer.removeListener('config:changed', handleConfigChange);
    };
  }, []);

  const updateTheme = useCallback((theme: string) => {
    ipcRenderer.invoke('config:update', { theme });
  }, []);

  const updateAlwaysOnTop = useCallback((alwaysOnTop: boolean) => {
    ipcRenderer.invoke('config:update', { alwaysOnTop });
  }, []);

  return { ...config, isReady: !!config, updateTheme, updateAlwaysOnTop };
}

export function useDofusWindows() {
  const [dofusWindows, setDofusWindows] = useState<string[]>([]);

  useEffect(() => {
    ipcRenderer.invoke('dofusWindows:fetchAll').then(setDofusWindows);
  }, []);

  return dofusWindows;
}
