import Store from 'electron-store';
import { Character } from '../../types';
import BaseRepository from './_base.repository';

export default class CharacterRepository extends BaseRepository<Character> {
  constructor(protected store: Store) {
    super();
  }

  get modelName() {
    return 'Character';
  }
}
