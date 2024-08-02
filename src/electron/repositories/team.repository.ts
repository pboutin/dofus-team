import Store from 'electron-store';
import { inject, singleton } from 'tsyringe';
import { Team } from '../common/types';
import BaseRepository from './_base.repository';

@singleton()
export default class TeamRepository extends BaseRepository<Team> {
  constructor(@inject('store') protected store: Store) {
    super();
  }
  get modelName() {
    return 'Team';
  }
}
