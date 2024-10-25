import classNames from 'classnames';
import React from 'react';

import Icon from './icon';
import { Character } from '../../types';
import { useCharacterAvatar } from '../hooks/use-ipc-renderer';

interface Props {
  character: Character;
  className?: string;
  compact?: boolean;
}

const CharacterAvatar = ({ character, compact = false, className }: Props) => {
  const base64 = useCharacterAvatar(character);

  if (!base64)
    return (
      <Icon
        icon="spinner"
        spin
        className={classNames({
          'fa-lg': !compact,
          'fa-sm': compact,
        })}
      />
    );

  return (
    <img
      className={classNames(
        {
          'h-10': !compact,
          'h-6': compact,
        },
        className,
      )}
      src={`data:image/png;base64,${base64}`}
      alt={character.name}
    />
  );
};

export default CharacterAvatar;
