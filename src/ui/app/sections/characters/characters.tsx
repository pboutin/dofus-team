import React, { useState } from 'react';
import Icon from 'components/icon';
import OrderableRow from 'components/orderable-row';
import useCharacters from 'hooks/use-characters';
import { Avatar, Character, Class, Created } from 'common/types';
import CharacterForm from 'app/sections/characters/character-form';
import Drawer from 'components/drawer';
import useTranslate from 'hooks/use-translate';
import CharacterAvatar from 'components/character-avatar';

const Characters = () => {
  const [characters, {
    upsertCharacter,
    removeCharacter,
    duplicateCharacter,
    reorderCharacters
  }] = useCharacters();
  const [stagedCharacter, setStagedCharacter] = useState<Character | Created<Character> | null>(null);
  const translate = useTranslate('app.characters');

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>{translate('character')}</th>
            <td className="text-right" colSpan={2}>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setStagedCharacter({
                    id: undefined,
                    name: '',
                    class: Class.Osamodas,
                    label: '',
                    gender: 'male',
                    avatar: Avatar.Good1
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
          {characters.map((character) => (
            <OrderableRow
              key={character.id}
              item={character}
              items={characters}
              onOrderChange={reorderCharacters}
            >
              <td>
                <div className="flex items-center gap-3">
                  <CharacterAvatar character={character} />
                  {character.name}
                </div>
              </td>
              <td>{character.label}</td>
              <td>
                <div className="flex justify-end gap-2 transition-all opacity-0 group-hover:opacity-100">
                  <button
                    type='button'
                    className='btn btn-secondary btn-sm btn-circle'
                    onClick={() => {
                      setStagedCharacter(character);
                    }}
                  >
                    <Icon icon="pencil" />
                  </button>
                  <button
                    type='button'
                    className='btn btn-secondary btn-sm btn-circle'
                    onClick={() => duplicateCharacter(character.id) }
                  >
                    <Icon icon="copy" />
                  </button>
                  <button
                    type='button'
                    className='btn btn-error btn-sm btn-circle'
                    onClick={() => removeCharacter(character.id)}
                  >
                    <Icon icon="trash" />
                  </button>
                </div>
              </td>
            </OrderableRow>
          ))}
        </tbody>
      </table>

      {stagedCharacter && (
        <Drawer onClose={() => setStagedCharacter(null)}>
          <CharacterForm
            character={stagedCharacter}
            onChange={(character) => setStagedCharacter(character)}
            onSubmit={() => {
              upsertCharacter(stagedCharacter);
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
