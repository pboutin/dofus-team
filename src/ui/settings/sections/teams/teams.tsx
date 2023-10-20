import React, { useState } from "react";
import { useCharacters, useTeams } from "hooks/use-api";
import { Team, Upserted } from "common/types";
import useTranslate from "hooks/use-translate";
import Icon from "components/icon";
import OrderableRow from "components/orderable-row";
import TeamForm from "settings/sections/teams/team-form";
import Drawer from "components/drawer";
import CharacterAvatar from "components/character-avatar";

const Teams = () => {
  const { items: teams, upsert, duplicate, destroy, reorder } = useTeams();
  const { itemsMap: charactersMap } = useCharacters();

  const [stagedTeam, setStagedTeam] = useState<Team | Upserted<Team> | null>(
    null
  );

  const translate = useTranslate("settings.teams");

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>{translate("team")}</th>
            <td className="text-right" colSpan={2}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setStagedTeam({
                    id: undefined,
                    name: "",
                    characterIds: [],
                  });
                }}
              >
                <Icon icon="user-plus" className="mr-2" />
                {translate("new")}
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
              onOrderChange={reorder}
            >
              <td>{team.name}</td>
              <td>
                <ul className="flex gap-3">
                  {team.characterIds.map((characterId) => (
                    <li key={characterId}>
                      <CharacterAvatar
                        character={charactersMap.get(characterId)}
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="flex justify-end gap-2 transition-all opacity-0 group-hover:opacity-100">
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
