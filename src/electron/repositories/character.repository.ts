import { Character } from '../common/types';
import BaseRepository from './base.repository';

export default class CharacterRepository extends BaseRepository<Character> {
  get modelName() {
    return 'Character';
  }
}
