import Store from 'electron-store';

import BaseRepository from './_base.repository';
import { Character } from '../../types';

export default class CharacterRepository extends BaseRepository<Character> {
  constructor(protected store: Store) {
    super();
  }

  get modelName() {
    return 'Character';
  }
}
