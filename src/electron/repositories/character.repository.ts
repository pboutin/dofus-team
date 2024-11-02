import BaseRepository from './_base.repository';
import { Character } from '../../types';

export default class CharacterRepository extends BaseRepository<Character> {
  constructor() {
    super();
  }

  get modelName() {
    return 'Character';
  }

  get defaultValues() {
    return {
      server: 'Imagiro',
    };
  }
}
