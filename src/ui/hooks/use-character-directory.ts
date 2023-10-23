import { DirectoryCharacter, Server } from "common/types";
import { useState } from "react";

const ipcRenderer = window.require("electron").ipcRenderer;

interface Hook {
  directoryCharacter: DirectoryCharacter | null;
  isLoading: boolean;
  fetch: (name: string, server: Server) => void;
}

export default function useCharacterDirectory(): Hook {
  const [directoryCharacter, setDirectoryCharacter] =
    useState<DirectoryCharacter | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async (name: string, server: Server) => {
    setIsLoading(true);

    ipcRenderer
      .invoke("character-directory:fetch", name, server)
      .then((character: DirectoryCharacter | null) => {
        setDirectoryCharacter(character);
        setIsLoading(false);
      });
  };

  return {
    directoryCharacter,
    isLoading,
    fetch,
  };
}
