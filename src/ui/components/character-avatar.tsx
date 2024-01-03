import React from 'react';
import classNames from 'classnames';

import avatarImages from './images/avatars';
import { Character } from '../common/types';

interface Props {
  character: Character;
  className?: string;
  compact?: boolean;
}

const CharacterAvatar = ({ character, compact, className }: Props) => {
  const avatarKey = [character.class, character.gender, character.avatar].join('-') as keyof typeof avatarImages;

  return (
    <img
      className={classNames(
        {
          'h-10': !compact,
          'h-6': !!compact,
        },
        className,
      )}
      src={avatarImages[avatarKey]}
      alt={avatarKey}
    />
  );
};

export default CharacterAvatar;
