import { useEffect, useState } from 'react';

import { Character, GenericModel, InstanciatedCharacter, KeyboardShortcut, Team } from '../common/types';

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

  const handleItemsChange = (_event, items: T[]) => {
    setItems(items);
    setItemsMap(new Map(items.map((item) => [item.id, item])));
  };

  useEffect(() => {
    ipcRenderer.invoke(`${modelName}:fetchAll`).then((items) => handleItemsChange(null, items));

    ipcRenderer.on(`${modelName}:changed`, handleItemsChange);

    return () => {
      ipcRenderer.removeListener(`${modelName}:changed`, handleItemsChange);
    };
  }, [ipcRenderer, modelName]);

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

export function useInstanciatedCharacters() {
  const modelName = 'InstanciatedCharacter';
  return {
    ...useApi<InstanciatedCharacter>(modelName),
    instanciateTeam: (teamId: string) => {
      ipcRenderer.invoke(`${modelName}:instanciateTeam`, teamId);
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
