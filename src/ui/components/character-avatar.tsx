import React from 'react';
import { Character } from 'common/types';
import avatarImages from 'common/images/avatars.json';
import classNames from 'classnames';

interface Props {
  character: Character;
  className?: string;
  compact?: boolean;
};

const CharacterAvatar = ({ character, compact, className }: Props) => {
  const avatarKey = [character.class, character.gender, character.avatar].join('-') as keyof typeof avatarImages;

  return (
    <img
      className={classNames({
        'h-10': !compact,
        'h-6': !!compact,
      }, className)}
      src={avatarImages[avatarKey]}
      alt={avatarKey}
    />
  );
};

export default CharacterAvatar;