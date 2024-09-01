import Store from 'electron-store';
import { inject, singleton } from 'tsyringe';
import { KeyboardShortcut, Upserted } from '../../types';
import BaseRepository from './_base.repository';

@singleton()
export default class KeyboardShortcutRepository extends BaseRepository<KeyboardShortcut> {
  constructor(@inject('store') protected store: Store) {
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
