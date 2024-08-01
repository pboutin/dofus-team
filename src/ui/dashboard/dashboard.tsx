import React from 'react';
import { createRoot } from 'react-dom/client';
import classNames from 'classnames';

import { useInstanciatedCharacters } from '../hooks/use-api';
import Icon from '../components/icon';
import RichTable from '../components/rich-table';
import CharacterAvatar from '../components/character-avatar';
import TeamSelector from '../components/team-selector';
import useTranslate from '../hooks/use-translate';

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

  const translate = useTranslate('dashboard');

  const handleDisableAll = () => {
    instanciatedCharacters.forEach((instanciatedCharacter) => {
      upsert({ ...instanciatedCharacter, disabled: true });
    });
  };

  const handleEnableAll = () => {
    instanciatedCharacters.forEach((instanciatedCharacter) => {
      upsert({ ...instanciatedCharacter, disabled: false });
    });
  };

  const handleToggleAll = () => {
    instanciatedCharacters.forEach((instanciatedCharacter) => {
      upsert({ ...instanciatedCharacter, disabled: !instanciatedCharacter.disabled });
    });
  };

  return (
    <>
      <div className="flex justify-between p-2">
        <TeamSelector label={translate('change-team')} onSelect={(team) => instanciateTeam(team.id)} />

        <div className="flex gap-2">
          <button type="button" className="btn btn-sm btn-primary" onClick={handleToggleAll}>
            <Icon icon="rotate" />
          </button>

          <button type="button" className="btn btn-sm btn-primary" onClick={handleDisableAll}>
            <Icon icon="pause" />
          </button>

          <button type="button" className="btn btn-sm btn-primary" onClick={handleEnableAll}>
            <Icon icon="play" />
          </button>

          <button type="button" className="btn btn-sm btn-primary ml-2" onClick={activatePrevious}>
            <Icon icon="arrow-left" />
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={activateNext}>
            <Icon icon="arrow-right" />
          </button>
        </div>
      </div>

      <table className="table table-compact w-full">
        <RichTable.Body onReorder={reorder} ids={instanciatedCharacters.map(({ id }) => id)}>
          {instanciatedCharacters.map((instanciatedCharacter) => (
            <RichTable.Row id={instanciatedCharacter.id} key={instanciatedCharacter.id}>
              <td>
                <div
                  className={classNames('flex items-center gap-3', {
                    'opacity-30': instanciatedCharacter.disabled,
                  })}
                >
                  {instanciatedCharacter.active && <Icon icon="chevron-right" />}
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
                    <Icon icon="up-right-from-square" />
                  </button>

                  {instanciatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={() => upsert({ ...instanciatedCharacter, disabled: false })}
                    >
                      <Icon icon="play" />
                    </button>
                  )}

                  {!instanciatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={() => upsert({ ...instanciatedCharacter, disabled: true })}
                    >
                      <Icon icon="pause" />
                    </button>
                  )}
                </div>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>
    </>
  );
};

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<Dashboard />);
