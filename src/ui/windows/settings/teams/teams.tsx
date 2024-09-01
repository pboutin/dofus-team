import React, { useState } from 'react';

import { Team, Upserted } from 'src/types';
import CharacterAvatar from 'src/ui/components/character-avatar';
import Drawer from 'src/ui/components/drawer';
import Icon from 'src/ui/components/icon';
import { useTeams, useCharacters } from 'src/ui/hooks/use-api';
import useTranslate from 'src/ui/hooks/use-translate';
import TeamForm from 'src/ui/windows/settings/teams/team-form';
import RichTable from 'src/ui/components/rich-table';

const Teams = () => {
  const { items: teams, upsert, duplicate, destroy, reorder } = useTeams();
  const { itemsMap: charactersMap } = useCharacters();

  const [stagedTeam, setStagedTeam] = useState<Team | Upserted<Team> | null>(null);

  const translate = useTranslate('settings.teams');

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>{translate('team')}</th>
            <td className="text-right" colSpan={2}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setStagedTeam({
                    id: undefined,
                    name: '',
                    characterIds: [],
                  });
                }}
              >
                <Icon icon="user-plus" className="mr-2" />
                {translate('new')}
              </button>
            </td>
          </tr>
        </thead>
        <RichTable.Body onReorder={reorder} ids={teams.map(({ id }) => id)}>
          {teams.map((team) => (
            <RichTable.Row id={team.id} key={team.id}>
              <td>{team.name}</td>
              <td>
                <ul className="flex gap-3">
                  {team.characterIds.map((characterId: string) => {
                    const character = charactersMap.get(characterId);
                    if (!character) return null;

                    return (
                      <li key={characterId}>
                        <CharacterAvatar character={character} compact />
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-circle"
                    onClick={() => {
                      setStagedTeam(team);
                    }}
                  >
                    <Icon icon="pencil" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-circle"
                    onClick={() => {
                      duplicate(team.id);
                    }}
                  >
                    <Icon icon="copy" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-sm btn-circle"
                    onClick={() => {
                      destroy(team.id);
                    }}
                  >
                    <Icon icon="trash" />
                  </button>
                </div>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>

      {stagedTeam && (
        <Drawer onClose={() => setStagedTeam(null)}>
          <TeamForm
            team={stagedTeam}
            onChange={(team) => setStagedTeam(team)}
            onSubmit={() => {
              upsert(stagedTeam);
              setStagedTeam(null);
            }}
            onCancel={() => setStagedTeam(null)}
          />
        </Drawer>
      )}
    </>
  );
};

export default Teams;
