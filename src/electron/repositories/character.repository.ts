import Store from 'electron-store';
import { inject, singleton } from 'tsyringe';
import { Character } from '../common/types';
import BaseRepository from './_base.repository';
import TeamRepository from './team.repository';

@singleton()
export default class CharacterRepository extends BaseRepository<Character> {
  constructor(@inject('store') protected store: Store) {
    super();
  }

  get modelName() {
    return 'Character';
  }
}
