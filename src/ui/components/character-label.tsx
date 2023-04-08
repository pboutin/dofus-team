import React from 'react';
import { Character } from 'common/types';
import avatarImages from 'common/images/avatars.json';
import classNames from 'classnames';

interface Props {
  character: Character;
  className?: string;
};

const CharacterLabel = ({ character, className }: Props) => {
  const avatarKey = [character.class, character.gender, character.avatar].join('-') as keyof typeof avatarImages;

  return (
    <div className={classNames('flex items-center gap-3', className)}>
      <img
        className="h-10"
        src={avatarImages[avatarKey]}
        alt={avatarKey}
      />

      <span>
        {character.name}
      </span>
    </div>
  );
};

export default CharacterLabel;
