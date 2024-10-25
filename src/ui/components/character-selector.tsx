import classNames from 'classnames';
import React, { useEffect, useMemo, useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import CharacterAvatar from './character-avatar';
import { Character } from '../../types';
import Icon from '../components/icon';
import { useCharacters } from '../hooks/use-ipc-renderer';

interface Props {
  label: string;
  onSelect: (character: Character) => void;
  excludeIds?: string[];
  className?: string;
  disabled?: boolean;
}

const CharacterSelector = ({ label, onSelect, className, excludeIds = [], disabled = false }: Props) => {
  const { items: characters } = useCharacters();
  const ref = useRef(null);
  const [isOpened, setIsOpened] = useToggle(false);
  useClickAway(ref, () => setIsOpened(false));

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => !excludeIds.includes(character.id));
  }, [characters, excludeIds]);

  useEffect(() => {
    if (filteredCharacters.length > 0 && !disabled) return;
    setIsOpened(false);
  }, [disabled, filteredCharacters, setIsOpened]);

  return (
    <div ref={ref} className={classNames('dropdown', { 'dropdown-open': isOpened }, className)}>
      <button
        disabled={filteredCharacters.length === 0 || disabled}
        type="button"
        className="btn btn-secondary btn-sm w-full justify-start"
        onClick={setIsOpened}
      >
        <Icon icon="user" className="mr-2" />
        {label}
      </button>

      <ul className="menu dropdown-content z-40 mt-1 max-h-80 w-full flex-nowrap overflow-x-hidden overflow-y-scroll rounded-box bg-base-300 p-2 shadow">
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
