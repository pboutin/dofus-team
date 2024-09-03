import classNames from 'classnames';
import React, { useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import { Team } from '../../types';
import CharacterAvatar from '../components/character-avatar';
import Icon from '../components/icon';
import { useCharacters, useTeams } from '../hooks/use-api';

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
        className="btn btn-sm btn-secondary w-full"
        disabled={teams.length === 0}
        onClick={setIsOpened}
      >
        <Icon icon="users" className="mr-2" />
        {label}
      </button>
      <ul className="dropdown-content menu mt-1 p-2 shadow bg-base-300 rounded-box w-80 max-h-80 flex-nowrap overflow-y-scroll overflow-x-hidden">
        {teams.map((team) => (
          <li key={team.id}>
            <a className="flex-col items-start" onClick={() => handleSelect(team)}>
              <div>{team.name}</div>
              <div className="flex gap-2 w-full">
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
