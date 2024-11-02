import { ipcMain } from 'electron';

import adapter from './dofus-windows-adapters/active';
import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';

interface DofusWindowsAdapter {
  focusDofusWindow: (characterName: string) => void;
  listDofusWindows: () => string[];
  getActiveDofusWindow: () => string | null;
}

export default class DofusWindows {
  private adapter: DofusWindowsAdapter = adapter;

  constructor(private instantiatedCharacterRepository: InstantiatedCharacterRepository) {
    this.instantiatedCharacterRepository.onActiveCharacterChange((character) => {
      this.focus(character.name);
    });

    ipcMain.handle('dofusWindows:fetchAll', () => this.fetchAll());

    setInterval(() => {
      const activeCharacterName = this.adapter.getActiveDofusWindow();
      if (!activeCharacterName) return;

      this.instantiatedCharacterRepository.activateByName(activeCharacterName);
    }, 1000);
  }

  fetchAll() {
    return this.adapter.listDofusWindows();
  }

  focus(characterName: string) {
    const activeCharacterName = this.adapter.getActiveDofusWindow();
    if (characterName === activeCharacterName) return;

    return this.adapter.focusDofusWindow(characterName);
  }
}
