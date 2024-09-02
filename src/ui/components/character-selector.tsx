import React, { useEffect, useMemo, useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';
import classNames from 'classnames';

import { useCharacters } from '../hooks/use-api';
import CharacterAvatar from '../components/character-avatar';
import { Character } from '../../types';
import Icon from '../components/icon';

interface Props {
  label: string;
  onSelect: (character: Character) => void;
  excludeIds?: string[];
  className?: string;
}

const CharacterSelector = ({ label, onSelect, className, excludeIds = [] }: Props) => {
  const { items: characters } = useCharacters();
  const ref = useRef(null);
  const [isOpened, setIsOpened] = useToggle(false);
  useClickAway(ref, () => setIsOpened(false));

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => !excludeIds.includes(character.id));
  }, [characters, excludeIds]);

  useEffect(() => {
    if (filteredCharacters.length > 0) return;
    setIsOpened(false);
  }, [filteredCharacters]);

  return (
    <div ref={ref} className={classNames('dropdown', { 'dropdown-open': isOpened }, className)}>
      <button
        disabled={filteredCharacters.length === 0}
        type="button"
        className="btn btn-sm btn-secondary w-full"
        onClick={setIsOpened}
      >
        <Icon icon="user" className="mr-2" />
        {label}
      </button>
      <ul className="dropdown-content menu mt-1 p-2 shadow bg-base-300 rounded-box w-80 max-h-80 flex-nowrap overflow-y-scroll">
        {filteredCharacters.map((character) => (
          <li key={character.id}>
            <a onClick={() => onSelect(character)}>
              <CharacterAvatar character={character} compact />
              {character.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterSelector;
