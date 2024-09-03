import Store from 'electron-store';

import BaseRepository from './_base.repository';
import { KeyboardShortcut, Upserted } from '../../types';

export default class KeyboardShortcutRepository extends BaseRepository<KeyboardShortcut> {
  constructor(protected store: Store) {
    super();
  }

  get modelName() {
    return 'KeyboardShortcut';
  }

  preUpsert(item: Upserted<KeyboardShortcut>) {
    this.fetchAll()
      .filter(({ keybind }) => keybind === item.keybind)
      .map(({ id }) => this.destroy(id));
  }
}
