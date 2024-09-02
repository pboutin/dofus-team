import React from 'react';
import classNames from 'classnames';

import avatarImages from './images/avatars';
import { Avatar, Class, Gender } from '../../types';

interface Props {
  avatar: Avatar;
  class: Class;
  gender: Gender;
  onChange: (avatar: Avatar) => void;
}

const AvatarPicker = ({ avatar: currentAvatar, class: characterClass, gender, onChange }: Props) => (
  <div className="flex gap-2 flex-wrap">
    {Object.keys(Avatar).map((rawAvatar) => {
      const avatar = Avatar[rawAvatar as keyof typeof Avatar];
      const avatarKey = [characterClass, gender, avatar].join('-') as keyof typeof avatarImages;

      return (
        <img
          key={avatarKey}
          className={classNames(
            'h-10 cursor-pointer rounded',
            currentAvatar === avatar && 'border-4 border-secondary scale-125',
          )}
          src={avatarImages[avatarKey]}
          alt={avatarKey}
          onClick={() => onChange(avatar)}
        />
      );
    })}
  </div>
);

export default AvatarPicker;
