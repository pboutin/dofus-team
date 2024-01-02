import React from 'react';
import { Character } from 'common/types';
import Icon from 'components/icon';
import AvatarPicker from 'components/avatar-picker';
import ClassGenderPicker from 'components/class-gender-picker';
import Input from 'components/input';
import useTranslate from 'hooks/use-translate';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CharacterForm = ({ character, onChange, onSubmit, onCancel }: Props) => {
  const translate = useTranslate('settings.characters.form');

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Input
        value={character.name}
        label={translate('name')}
        help={translate('name-help')}
        onChange={(name) => onChange({ ...character, name })}
      />

      <ClassGenderPicker
        class={character.class}
        gender={character.gender}
        onChange={(classAndGender) => onChange({ ...character, ...classAndGender })}
      />

      <AvatarPicker
        avatar={character.avatar}
        class={character.class}
        gender={character.gender}
        onChange={(avatar) => onChange({ ...character, avatar })}
      />

      <div className="flex gap-3 absolute bottom-0 w-full">
        <button type="button" className="btn btn-sm btn-secondary w-2/3 flex-auto" onClick={onSubmit}>
          <Icon icon="save" className="mr-2" />
          {translate('save')}
        </button>

        <button type="button" className="btn btn-sm btn-ghost w-1/3 flex-auto" onClick={onCancel}>
          <Icon icon="times" className="mr-2" />
          {translate('cancel')}
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
