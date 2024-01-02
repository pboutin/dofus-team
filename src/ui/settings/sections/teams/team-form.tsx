import React, { useMemo } from 'react';
import { Team } from 'common/types';
import RichTable from 'components/rich-table';
import Input from 'components/input';
import useTranslate from 'hooks/use-translate';
import Icon from 'components/icon';
import CharacterSelector from 'components/character-selector';
import CharacterAvatar from 'components/character-avatar';
import { useCharacters } from 'hooks/use-api';

interface Props {
  team: Team;
  onChange: (team: Team) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TEAM_SLOTS = 8;

const TeamForm = ({ team, onChange, onSubmit, onCancel }: Props) => {
  const translate = useTranslate('settings.teams.form');
  const { items: characters } = useCharacters();

  const teamCharacters = useMemo(() => {
    return team.characterIds
      .map((characterId) => {
        return characters.find(({ id }) => id === characterId);
      })
      .filter(Boolean);
  }, [team, characters]);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Input value={team.name} label={translate('name')} onChange={(name) => onChange({ ...team, name })} />

      {teamCharacters.length < TEAM_SLOTS && (
        <CharacterSelector
          label={translate('add-character')}
          excludeIds={team.characterIds}
          onSelect={(character) =>
            onChange({
              ...team,
              characterIds: [...team.characterIds, character.id],
            })
          }
        />
      )}

      <table className="table table-compact w-full">
        <RichTable.Body
          onReorder={(characterIds) => {
            onChange({
              ...team,
              characterIds,
            });
          }}
          ids={team.characterIds}
        >
          {teamCharacters.map((character) => (
            <RichTable.Row id={character.id} key={character.id}>
              <td>
                <div className="flex items-center gap-2">
                  <CharacterAvatar character={character} compact />
                  {character.name}
                </div>
              </td>
              <td className="text-right">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm btn-circle"
                  onClick={() =>
                    onChange({
                      ...team,
                      characterIds: team.characterIds.filter((id) => id !== character.id),
                    })
                  }
                >
                  <Icon icon="times" />
                </button>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>

      <div className="flex gap-3 absolute bottom-0 w-full">
        <button type="button" className="btn btn-sm btn-secondary w-2/3 flex-auto" onClick={onSubmit}>
          <Icon icon="save" className="mr-2" />
          {translate('save')}
        </button>

        <button type="button" className="btn btn-sm btn-ghost w-1/3 flex-auto" onClick={onCancel}>
          <Icon icon="times" className="mr-2" />
          {translate('cancel')}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
