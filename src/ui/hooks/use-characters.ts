import { useEffect, useState } from 'react';
import { Character } from 'common/types';

const ipcRenderer = window.require("electron").ipcRenderer;

type Hook = [
  Character[],
  {
    upsertCharacter: (character: Character | Omit<Character, 'id'>) => void;
    removeCharacter: (characterId: string) => void;
    duplicateCharacter: (characterId: string) => void;
    reorderCharacters: (characterIds: string[]) => void;
  }
];

export default function useCharacters(): Hook {
  const [characters, setCharacters] = useState<Character[]>([]);

  const handleCharctersChange = (event, characters: Character[]) => {
    setCharacters(characters);
  };

  useEffect(() => {
    ipcRenderer.invoke('getCharacters').then(setCharacters);
    ipcRenderer.on('charactersChanged', handleCharctersChange);

    return () => {
      ipcRenderer.removeListener('charactersChanged', handleCharctersChange);
    };
  }, []);

  return [
    characters,
    {
      upsertCharacter: (character: Character) => {
        ipcRenderer.invoke('upsertCharacter', character);
      },
      removeCharacter: (characterId: string) => {
        ipcRenderer.invoke('removeCharacter', characterId);
      },
      duplicateCharacter: (characterId: string) => {
        ipcRenderer.invoke('duplicateCharacter', characterId);
      },
      reorderCharacters: (characterIds: string[]) => {
        ipcRenderer.invoke('reorderCharacters', characterIds);
      }
    }
  ];
}
