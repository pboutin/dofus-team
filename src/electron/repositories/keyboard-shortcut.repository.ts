import Store from 'electron-store';
import { KeyboardShortcut, Upserted } from '../../types';
import BaseRepository from './_base.repository';

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
