import os from 'os';
import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';

interface DofusWindowsAdapter {
  focusDofusWindow: (characterName: string) => void;
  listDofusWindows: () => string[];
}

export default class DofusWindows {
  private adapter: DofusWindowsAdapter;

  constructor(private instantiatedCharacterRepository: InstantiatedCharacterRepository) {
    this.instantiatedCharacterRepository.onActiveCharacterChange((character) => {
      this.focus(character.name);
    });

    if (os.platform() === 'win32') {
      this.loadAdapter('./windows.js');
    } else {
      this.loadAdapter('./debug.js');
    }
  }

  fetchAll() {
    return this.adapter.listDofusWindows();
  }

  focus(characterName: string) {
    return this.adapter.focusDofusWindow(characterName);
  }

  private loadAdapter(path: string) {
    import(path)
      .then(({ default: adapter }) => {
        this.adapter = adapter;
      })
      .catch(console.error);
  }
}
