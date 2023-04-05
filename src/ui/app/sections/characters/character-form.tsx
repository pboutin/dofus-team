import React from 'react';
import { Character, Class } from 'common/types';
import images from 'common/images/images.json';
import classNames from 'classnames';
import Icon from 'components/icon';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CharacterForm = ({ character, onChange, onSubmit, onCancel }: Props) => {
  return (
    <form className="flex flex-col gap-2" onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={character.name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...character, name: event.target.value })}
      />

      <div className="flex gap-2 flex-wrap">
        {Object.keys(Class).map((rawClass) => {
          const characterClass = Class[rawClass as keyof typeof Class];
          return (
            <div className="flex" key={rawClass}>
              <img
                className={classNames('h-11 cursor-pointer rounded-l', character.class === characterClass && character.gender === 'male' ? 'border-4 opacity-100 border-secondary z-10 scale-125' : 'z-0 opacity-60')}
                src={images[`classes/${Class[rawClass as keyof typeof Class]}-male.jpg`]}
                alt={`${characterClass} male`}
                onClick={() => onChange({
                  ...character,
                  class: characterClass,
                  gender: 'male'
                })}
              />
              <img
                className={classNames('h-11 cursor-pointer rounded-r', character.class === characterClass && character.gender === 'female' ? 'border-4 opacity-100 border-secondary z-10 scale-125' : 'z-0 opacity-60')}
                src={images[`classes/${Class[rawClass as keyof typeof Class]}-female.jpg`]}
                alt={`${characterClass} female`}
                onClick={() => onChange({
                  ...character,
                  class: characterClass,
                  gender: 'female'
                })}
              />
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onSubmit}
      >
        <Icon icon="save" />
        Save
      </button>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onCancel}
      >
        <Icon icon="times" />
        Cancel
      </button>
    </form>
  );
};

export default CharacterForm;
