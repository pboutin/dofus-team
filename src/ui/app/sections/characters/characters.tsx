import React, { useState } from 'react';
import Icon from 'components/icon';
import OrderableRow from 'components/orderable-row';
import useCharacters from 'hooks/use-characters';
import { Avatar, Character, Class, Created } from 'common/types';
import CharacterForm from 'app/sections/characters/character-form';
import Drawer from 'components/drawer';

const Characters = () => {
  const [characters, {
    upsertCharacter,
    removeCharacter,
    duplicateCharacter,
    reorderCharacters
  }] = useCharacters();
  const [stagedCharacter, setStagedCharacter] = useState<Character | Created<Character> | null>(null);
  
  return (
    <>
      <table className="table w-full">
        <colgroup>
          <col width="20%" />
          <col width="*" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Class</th>
            <th></th>
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
              <td>{character.name}</td>
              <td>{character.class}</td>
              <td className="flex justify-end gap-2">
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
                  className='btn btn-secondary btn-sm btn-circle'
                  onClick={() => removeCharacter(character.id)}
                >
                  <Icon icon="trash" />
                </button>
              </td>
            </OrderableRow>
          ))}
        </tbody>
      </table>

      <button
        type='button'
        className='btn btn-primary'
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
        Add Character
      </button>

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
