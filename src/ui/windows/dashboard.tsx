import React, { useMemo } from 'react';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';

import { useInstantiatedCharacters } from '../hooks/use-api';
import Icon from '../components/icon';
import RichTable from '../components/rich-table';
import CharacterAvatar from '../components/character-avatar';
import TeamSelector from '../components/team-selector';
import useTranslate from '../hooks/use-translate';
import CharacterSelector from '../components/character-selector';

const Dashboard = () => {
  const {
    items: instantiatedCharacters,
    upsert,
    clear,
    destroy,
    reorder,
    instantiateTeam: instantiateTeam,
    activate,
    activateNext,
    activatePrevious,
  } = useInstantiatedCharacters();

  const translate = useTranslate('dashboard');

  const userIds = useMemo(() => instantiatedCharacters.map(({ id }) => id), [instantiatedCharacters]);

  const handleDisableAll = () => {
    instantiatedCharacters.forEach((instantiatedCharacter) => {
      upsert({ ...instantiatedCharacter, disabled: true });
    });
  };

  const handleEnableAll = () => {
    instantiatedCharacters.forEach((instantiatedCharacter) => {
      upsert({ ...instantiatedCharacter, disabled: false });
    });
  };

  const handleToggleAll = () => {
    instantiatedCharacters.forEach((instantiatedCharacter) => {
      upsert({ ...instantiatedCharacter, disabled: !instantiatedCharacter.disabled });
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <CharacterSelector
          label={translate('add-character')}
          excludeIds={userIds}
          className=""
          onSelect={(character) => upsert({ ...character, active: false, disabled: false })}
        />

        <TeamSelector label={translate('change-team')} className="" onSelect={(team) => instantiateTeam(team.id)} />

        <div className="flex justify-between mt-2 gap-2">
          <div className="flex gap-2">
            <button type="button" className="btn btn-sm btn-primary" onClick={handleEnableAll}>
              <Icon icon="play" />
            </button>

            <button type="button" className="btn btn-sm btn-primary" onClick={handleDisableAll}>
              <Icon icon="pause" />
            </button>

            <button type="button" className="btn btn-sm btn-primary" onClick={handleToggleAll}>
              <Icon icon="rotate" />
            </button>
          </div>

          <div className="flex gap-2">
            <button type="button" className="btn btn-sm btn-primary ml-2" onClick={activatePrevious}>
              <Icon icon="arrow-left" />
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={activateNext}>
              <Icon icon="arrow-right" />
            </button>
          </div>

          <button type="button" className="btn btn-sm btn-error btn-circle" onClick={clear}>
            <Icon icon="trash" />
          </button>
        </div>
      </div>

      <table className="table table-compact w-full">
        <RichTable.Body onReorder={reorder} ids={instantiatedCharacters.map(({ id }) => id)}>
          {instantiatedCharacters.map((instantiatedCharacter) => (
            <RichTable.Row id={instantiatedCharacter.id} key={instantiatedCharacter.id}>
              <td>
                <div
                  className={classNames('flex items-center gap-3', {
                    'opacity-30': instantiatedCharacter.disabled,
                  })}
                >
                  {instantiatedCharacter.active && <Icon icon="chevron-right" />}
                  <CharacterAvatar character={instantiatedCharacter} />
                  {instantiatedCharacter.name}
                </div>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-circle"
                    onClick={() => activate(instantiatedCharacter.id)}
                  >
                    <Icon icon="up-right-from-square" />
                  </button>

                  {instantiatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={() => upsert({ ...instantiatedCharacter, disabled: false })}
                    >
                      <Icon icon="play" />
                    </button>
                  )}

                  {!instantiatedCharacter.disabled && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={() => upsert({ ...instantiatedCharacter, disabled: true })}
                    >
                      <Icon icon="pause" />
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-error btn-sm btn-circle ml-1"
                    onClick={() => destroy(instantiatedCharacter.id)}
                  >
                    <Icon icon="trash" />
                  </button>
                </div>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>
    </>
  );
};

createRoot(document.getElementById('root')).render(<Dashboard />);
