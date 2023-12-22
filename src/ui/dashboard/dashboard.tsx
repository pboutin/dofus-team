import React from "react";
import { createRoot } from "react-dom/client";
import Icon from "components/icon";
import { useInstanciatedCharacters } from "hooks/use-api";
import RichTable from "components/rich-table";
import CharacterAvatar from "components/character-avatar";
import TeamSelector from "components/team-selector";
import useTranslate from "hooks/use-translate";
import classNames from "classnames";

const Dashboard = () => {
  const {
    items: instanciatedCharacters,
    upsert,
    reorder,
    instanciateTeam,
    activate,
    activateNext,
    activatePrevious,
  } = useInstanciatedCharacters();

  const translate = useTranslate("dashboard");

  return (
    <>
      <TeamSelector
        label={translate("change-team")}
        onSelect={(team) => instanciateTeam(team.id)}
        className="m-2"
      />

      <table className="table table-compact w-full">
        <RichTable.Body
          onReorder={reorder}
          ids={instanciatedCharacters.map(({ id }) => id)}
        >
          {instanciatedCharacters.map((instanciatedCharacter) => (
            <RichTable.Row
              id={instanciatedCharacter.id}
              key={instanciatedCharacter.id}
            >
              <td>
                <div
                  className={classNames("flex items-center gap-3", {
                    "opacity-30": instanciatedCharacter.disabled,
                  })}
                >
                  {instanciatedCharacter.active && (
                    <Icon icon="chevron-right" />
                  )}
                  <CharacterAvatar character={instanciatedCharacter} />
                  {instanciatedCharacter.name}
                </div>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-circle"
                    onClick={() => activate(instanciatedCharacter.id)}
                  >
                    <Icon icon="right-to-bracket" />
                  </button>

                  {instanciatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-success btn-sm btn-circle"
                      onClick={() =>
                        upsert({ ...instanciatedCharacter, disabled: false })
                      }
                    >
                      <Icon icon="eye" />
                    </button>
                  )}

                  {!instanciatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-error btn-sm btn-circle"
                      onClick={() =>
                        upsert({ ...instanciatedCharacter, disabled: true })
                      }
                    >
                      <Icon icon="eye-slash" />
                    </button>
                  )}
                </div>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>

      <div className="flex justify-center gap-2 mt-2">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={activatePrevious}
        >
          <Icon icon="arrow-left" />
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={activateNext}
        >
          <Icon icon="arrow-right" />
        </button>
      </div>
    </>
  );
};

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<Dashboard />);
