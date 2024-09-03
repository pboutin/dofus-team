import Store from 'electron-store';

import BaseRepository from './_base.repository';
import { Team } from '../../types';

export default class TeamRepository extends BaseRepository<Team> {
  constructor(protected store: Store) {
    super();
  }
  get modelName() {
    return 'Team';
  }
}
