import classNames from 'classnames';
import React from 'react';

interface Props {
  icon: string;
  className?: string;
  beat?: boolean;
  spin?: boolean;
}

const Icon = ({ icon, className, beat = false, spin = false }: Props) => (
  <i className={classNames('fa-solid', `fa-${icon}`, { 'fa-beat': beat, 'fa-spin': spin }, className)} />
);
export default Icon;
