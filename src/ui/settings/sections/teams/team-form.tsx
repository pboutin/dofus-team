import React from 'react';
import { Character, Team } from 'common/types';
import Input from 'components/input';
import useTranslate from 'hooks/use-translate';
import Icon from 'components/icon';
import { sortBy } from 'lodash';
import CharacterSelector from 'components/character-selector';
import CharacterAvatar from 'components/character-avatar';
import OrderableRow from 'components/orderable-row';

interface Props {
  team: Team;
  onChange: (team: Team) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TEAM_SLOTS = 8;

const TeamForm = ({ team, onChange, onSubmit, onCancel }: Props) => {
  const translate = useTranslate('settings.teams.form');



  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}>
      <Input
        value={team.name}
        label={translate('name')}
        onChange={(name) => onChange({ ...team, name })}
      />

      {team.characters.length < TEAM_SLOTS && (<CharacterSelector
        label={translate('add-character')}
        exclude={team.characters}
        onSelect={(character) => onChange({
          ...team,
          characters: [...team.characters, character]
        })}
      />)}

      <table className="table table-compact w-full">
        <tbody>
          {team.characters.map((character) => (
            <OrderableRow
              key={character.id}
              item={character}
              items={team.characters}
              onOrderChange={(characterIds) => {
                const charactersMap = team.characters.reduce((acc, character) => {
                  acc[character.id] = character;
                  return acc;
                }, {} as Record<string, Character>);

                onChange({
                  ...team,
                  characters: characterIds.map((id) => charactersMap[id])
                });
              }}
            >
              <td>
                <div className="flex items-center gap-2">
                  <CharacterAvatar character={character} compact />
                  {character.name}
                </div>
              </td>
              <td className='text-right'>
                <button
                  type="button"
                  className='btn btn-secondary btn-sm btn-circle'
                  onClick={() => onChange({
                    ...team,
                    characters: team.characters.filter(({id}) => id !== character.id)
                  })}
                >
                  <Icon icon="times" />
                </button>
              </td>
            </OrderableRow>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 absolute bottom-0 w-full">
        <button
          type="button"
          className="btn btn-sm btn-secondary w-2/3 flex-auto"
          onClick={onSubmit}
        >
          <Icon icon="save" className="mr-2" />
          {translate('save')}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-ghost w-1/3 flex-auto"
          onClick={onCancel}
        >
          <Icon icon="times" className="mr-2" />
          {translate('cancel')}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
