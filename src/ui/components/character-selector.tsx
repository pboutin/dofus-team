import React, { useMemo, useRef } from "react";
import { Character } from "common/types";
import { useCharacters } from "hooks/use-api";
import { useClickAway, useToggle } from "react-use";
import classNames from "classnames";
import CharacterAvatar from "components/character-avatar";
import Icon from "components/icon";

interface Props {
  label: string;
  onSelect: (character: Character) => void;
  excludeIds?: string[];
}

const CharacterSelector = ({ label, onSelect, excludeIds = [] }: Props) => {
  const { items: characters } = useCharacters();
  const ref = useRef(null);
  const [isOpened, setIsOpened] = useToggle(false);
  useClickAway(ref, () => setIsOpened(false));

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => !excludeIds.includes(character.id));
  }, [characters, excludeIds]);

  if (filteredCharacters.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={classNames("dropdown", { "dropdown-open": isOpened })}
    >
      <button
        type="button"
        className="btn btn-sm btn-secondary w-full"
        onClick={setIsOpened}
      >
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
