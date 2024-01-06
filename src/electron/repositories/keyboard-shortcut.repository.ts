import { KeyboardShortcut, Upserted } from '../common/types';
import BaseRepository from './base.repository';

export default class KeyboardShortcutRepository extends BaseRepository<KeyboardShortcut> {
  get modelName() {
    return 'KeyboardShortcut';
  }

  preUpsert(item: Upserted<KeyboardShortcut>) {
    this.fetchAll()
      .filter(({ keybind }) => keybind === item.keybind)
      .map(({ id }) => this.destroy(id));
  }
}
