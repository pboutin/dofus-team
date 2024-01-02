import { KeyboardShortcut } from '../common/types';
import BaseRepository from './base.repository';

export default class KeyboardShortcutRepository extends BaseRepository<KeyboardShortcut> {
  get modelName() {
    return 'KeyboardShortcut';
  }
}
