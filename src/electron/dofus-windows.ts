import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import adapter from './dofus-windows-adapters/active';
import { ipcMain } from 'electron';

interface DofusWindowsAdapter {
  focusDofusWindow: (characterName: string) => void;
  listDofusWindows: () => string[];
}

export default class DofusWindows {
  private adapter: DofusWindowsAdapter = adapter;

  constructor(private instantiatedCharacterRepository: InstantiatedCharacterRepository) {
    this.instantiatedCharacterRepository.onActiveCharacterChange((character) => {
      this.focus(character.name);
    });

    ipcMain.handle('dofusWindows:fetchAll', () => this.fetchAll());
  }

  fetchAll() {
    return this.adapter.listDofusWindows();
  }

  focus(characterName: string) {
    return this.adapter.focusDofusWindow(characterName);
  }
}
