import Store from 'electron-store';
import { Team } from '../../types';
import BaseRepository from './_base.repository';

export default class TeamRepository extends BaseRepository<Team> {
  constructor(protected store: Store) {
    super();
  }
  get modelName() {
    return 'Team';
  }
}
