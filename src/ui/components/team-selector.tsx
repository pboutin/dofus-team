import React, { useRef } from "react";
import { Team } from "common/types";
import { useCharacters, useTeams } from "hooks/use-api";
import { useClickAway, useToggle } from "react-use";
import classNames from "classnames";
import CharacterAvatar from "components/character-avatar";

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
    <div
      ref={ref}
      className={classNames(
        "dropdown",
        { "dropdown-open": isOpened },
        className
      )}
    >
      <button
        type="button"
        className="btn btn-sm btn-secondary w-full"
        onClick={setIsOpened}
      >
        {label}
      </button>
      <ul className="dropdown-content menu mt-1 p-2 shadow bg-base-300 rounded-box w-80 max-h-80 flex-nowrap overflow-y-scroll overflow-x-hidden">
        {teams.map((team) => (
          <li key={team.id}>
            <a
              className="flex-col items-start"
              onClick={() => handleSelect(team)}
            >
              <div>{team.name}</div>
              <div className="flex gap-2 w-full">
                {team.characterIds.map((characterId) => {
                  const character = charactersMap.get(characterId);
                  if (!character) return null;

                  return (
                    <CharacterAvatar
                      key={characterId}
                      character={character}
                      compact
                    />
                  );
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
