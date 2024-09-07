import React, { useMemo } from 'react';

import { Character } from '../../../../types';
import AvatarPicker from '../../../components/avatar-picker';
import ClassGenderPicker from '../../../components/class-gender-picker';
import Icon from '../../../components/icon';
import Input from '../../../components/input';
import { useCharacters, useDofusWindows } from '../../../hooks/use-ipc-renderer';
import useTranslate from '../../../hooks/use-translate';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CharacterForm = ({ character, onChange, onSubmit, onCancel }: Props) => {
  const translate = useTranslate('settings.characters.form');
  const dofusWindows = useDofusWindows();
  const { items: existingCharacters } = useCharacters();

  const pendingDofusWindows = useMemo(() => {
    return dofusWindows.filter(
      (dofusWindow) => !existingCharacters.some((character) => character.name === dofusWindow.character),
    );
  }, [dofusWindows, existingCharacters]);

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <form
        className="flex flex-col gap-6 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {pendingDofusWindows.length > 0 ? (
          <div role="alert" className="alert alert-info flex flex-col items-start">
            <div className="flex gap-2">
              <Icon icon="circle-info" />
              <div>{translate('detected-dofus-windows')}</div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {pendingDofusWindows.map((dofusWindow) => (
                <button
                  key={dofusWindow.character}
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={() => onChange({ ...character, name: dofusWindow.character })}
                >
                  {dofusWindow.character}
                </button>
              ))}
            </div>
          </div>
        ) : null}

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
      </form>

      <div className="flex gap-3">
        <button type="button" className="btn btn-sm btn-secondary w-2/3 flex-auto" onClick={onSubmit}>
          <Icon icon="save" className="mr-2" />
          {translate('save')}
        </button>

        <button type="button" className="btn btn-sm btn-ghost w-1/3 flex-auto" onClick={onCancel}>
          <Icon icon="times" className="mr-2" />
          {translate('cancel')}
        </button>
      </div>
    </div>
  );
};

export default CharacterForm;
