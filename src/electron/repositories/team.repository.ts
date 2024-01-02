import { Team } from '../common/types';
import BaseRepository from './base.repository';

export default class TeamRepository extends BaseRepository<Team> {
  get modelName() {
    return 'Team';
  }
}
