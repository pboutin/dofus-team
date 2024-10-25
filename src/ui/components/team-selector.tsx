import classNames from 'classnames';
import React, { useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import CharacterAvatar from './character-avatar';
import { Team } from '../../types';
import Icon from '../components/icon';
import { useCharacters, useTeams } from '../hooks/use-ipc-renderer';

interface Props {
  label: string;
  onSelect: (team: Team) => void;
  className?: string;
}

const TeamSelector = ({ label, onSelect, className }: Props) => {
  const { items: teams } = useTeams();
  const { itemsMap: charactersMap } = useCharacters();

  const ref = useRef(null);
  const [isOpened, setIsOpened] = useToggle(false);
  useClickAway(ref, () => setIsOpened(false));

  const handleSelect = (team: Team) => {
    setIsOpened(false);
    onSelect(team);
  };

  return (
    <div ref={ref} className={classNames('dropdown', { 'dropdown-open': isOpened }, className)}>
      <button
        type="button"
        className="btn btn-secondary btn-sm w-full justify-start"
        disabled={teams.length === 0}
        onClick={setIsOpened}
      >
        <Icon icon="users" className="mr-2" />
        {label}
      </button>

      <ul className="menu dropdown-content z-40 mt-1 max-h-80 w-full flex-nowrap overflow-x-hidden overflow-y-scroll rounded-box bg-base-300 p-2 shadow">
        {teams.map((team) => (
          <li key={team.id}>
            <a className="items-center justify-between" onClick={() => handleSelect(team)}>
              <div className="flex-1">{team.name}</div>
              <div className="flex min-w-[200px] justify-end gap-2">
                {team.characterIds.map((characterId: string) => {
                  const character = charactersMap.get(characterId);
                  if (!character) return null;

                  return <CharacterAvatar key={characterId} character={character} compact />;
                })}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamSelector;
