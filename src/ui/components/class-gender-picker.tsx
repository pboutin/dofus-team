import React from 'react';
import classNames from 'classnames';

import classImages from './images/classes';
import { Class, Gender } from '../../types';

interface ClassAndGender {
  class: Class;
  gender: Gender;
}

interface Props {
  class: Class;
  gender: Gender;
  onChange: (classAndGender: ClassAndGender) => void;
}

const ClassGenderPicker = ({ class: currentClass, gender: currentGender, onChange }: Props) => (
  <div className="flex gap-2 flex-wrap">
    {Object.keys(Class).map((rawClass) => {
      const characterClass = Class[rawClass as keyof typeof Class];
      return (
        <div className="flex" key={rawClass}>
          <img
            className={classNames(
              'h-11 cursor-pointer rounded-l',
              currentClass === characterClass && currentGender === 'male'
                ? 'border-4 opacity-100 border-secondary z-10 scale-125'
                : 'z-0 opacity-60',
            )}
            src={classImages[`${characterClass}-male`]}
            alt={`${characterClass} male`}
            onClick={() =>
              onChange({
                class: characterClass,
                gender: 'male',
              })
            }
          />
          <img
            className={classNames(
              'h-11 cursor-pointer rounded-r',
              currentClass === characterClass && currentGender === 'female'
                ? 'border-4 opacity-100 border-secondary z-10 scale-125'
                : 'z-0 opacity-60',
            )}
            src={classImages[`${characterClass}-female`]}
            alt={`${characterClass} female`}
            onClick={() =>
              onChange({
                class: characterClass,
                gender: 'female',
              })
            }
          />
        </div>
      );
    })}
  </div>
);

export default ClassGenderPicker;
