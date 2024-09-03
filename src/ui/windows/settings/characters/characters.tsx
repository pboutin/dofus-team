import React, { useState } from 'react';

import { Character, Upserted, Class, Avatar } from '../../../../types';
import CharacterAvatar from '../../../components/character-avatar';
import Drawer from '../../../components/drawer';
import Icon from '../../../components/icon';
import RichTable from '../../../components/rich-table';
import { useCharacters } from '../../../hooks/use-ipc-renderer';
import useTranslate from '../../../hooks/use-translate';
import CharacterForm from '../../../windows/settings/characters/character-form';

const Characters = () => {
  const { items: characters, upsert, duplicate, destroy, reorder } = useCharacters();

  const [stagedCharacter, setStagedCharacter] = useState<Character | Upserted<Character> | null>(null);
  const translate = useTranslate('settings.characters');

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>{translate('character')}</th>
            <td className="text-right" colSpan={2}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setStagedCharacter({
                    id: undefined,
                    name: '',
                    class: Class.Osamodas,
                    label: '',
                    gender: 'male',
                    avatar: Avatar.Good1,
                  });
                }}
              >
                <Icon icon="user-plus" className="mr-2" />
                {translate('new')}
              </button>
            </td>
          </tr>
        </thead>
        <RichTable.Body onReorder={reorder} ids={characters.map(({ id }) => id)}>
          {characters.map((character) => (
            <RichTable.Row id={character.id} key={character.id}>
              <td>
                <div className="flex items-center gap-3">
                  <CharacterAvatar character={character} />
                  {character.name}
                </div>
              </td>
              <td className="opacity-0 group-hover:opacity-100">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-circle"
                    onClick={() => {
                      setStagedCharacter(character);
                    }}
                  >
                    <Icon icon="pencil" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-circle"
                    onClick={() => duplicate(character.id)}
                  >
                    <Icon icon="copy" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-sm btn-circle"
                    onClick={() => destroy(character.id)}
                  >
                    <Icon icon="trash" />
                  </button>
                </div>
              </td>
            </RichTable.Row>
          ))}
        </RichTable.Body>
      </table>

      {stagedCharacter && (
        <Drawer onClose={() => setStagedCharacter(null)}>
          <CharacterForm
            character={stagedCharacter}
            onChange={(character) => setStagedCharacter(character)}
            onSubmit={() => {
              upsert(stagedCharacter);
              setStagedCharacter(null);
            }}
            onCancel={() => setStagedCharacter(null)}
          />
        </Drawer>
      )}
    </>
  );
};

export default Characters;
