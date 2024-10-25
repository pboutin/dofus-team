import classNames from 'classnames';
import React from 'react';

interface Props {
  icon: string;
  className?: string;
  beat?: boolean;
  spin?: boolean;
  fixedWith?: boolean;
}

const Icon = ({ icon, className, beat = false, spin = false, fixedWith = false }: Props) => (
  <i
    className={classNames(
      'fa-solid',
      `fa-${icon}`,
      { 'fa-beat': beat, 'fa-spin': spin, 'fa-fw': fixedWith },
      className,
    )}
  />
);
export default Icon;
