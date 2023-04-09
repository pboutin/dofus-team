import React, { useState } from "react";
import useTeams from "hooks/use-teams";
import { Team, Created } from "common/types";
import useTranslate from "hooks/use-translate";
import Icon from "components/icon";
import OrderableRow from "components/orderable-row";
import TeamForm from "app/sections/teams/team-form";
import Drawer from "components/drawer";
import CharacterAvatar from "components/character-avatar";

const Teams = () => {
  const [teams, {
    upsertTeam,
    removeTeam,
    duplicateTeam,
    reorderTeams
  }] = useTeams();
  const [stagedTeam, setStagedTeam] = useState<Team | Created<Team> | null>(null);
  const translate = useTranslate('app.teams');

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>{translate('team')}</th>
            <td className="text-right" colSpan={2}>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setStagedTeam({
                    id: undefined,
                    name: '',
                    characters: []
                  });
                }}
              >
                <Icon icon="user-plus" className="mr-2" />
                {translate('new')}
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <OrderableRow
              key={team.id}
              item={team}
              items={teams}
              onOrderChange={reorderTeams}
            >
              <td>
                {team.name}
              </td>
              <td>
                <ul className="flex gap-3">
                  {team.characters.map((character) => (
                    <li key={character.id}>
                      <CharacterAvatar character={character} compact />
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="flex justify-end gap-2 transition-all opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      className='btn btn-secondary btn-sm btn-circle'
                      onClick={() => {
                        setStagedTeam(team);
                      }}
                    >
                      <Icon icon="pencil" />
                    </button>
                    <button
                      type="button"
                      className='btn btn-secondary btn-sm btn-circle'
                      onClick={() => {
                        duplicateTeam(team.id);
                      }}
                    >
                      <Icon icon="copy" />
                    </button>
                    <button
                      type="button"
                      className='btn btn-secondary btn-sm btn-circle'
                      onClick={() => {
                        removeTeam(team.id);
                      }}
                    >
                      <Icon icon="trash" />
                    </button>
                </div>
              </td>
            </OrderableRow>
          ))}
        </tbody>
      </table>

      {stagedTeam && (
        <Drawer onClose={() => setStagedTeam(null)}>
          <TeamForm
            team={stagedTeam}
            onChange={(team) => setStagedTeam(team)}
            onSubmit={() => {
              upsertTeam(stagedTeam);
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
