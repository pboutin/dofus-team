import BaseRepository from './_base.repository';
import { Team } from '../../types';

export default class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super();
  }

  get modelName() {
    return 'Team';
  }
}
