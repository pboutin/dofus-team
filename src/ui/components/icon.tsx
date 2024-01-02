import classNames from 'classnames';
import React from 'react';

interface Props {
  icon: string;
  className?: string;
  beat?: boolean;
}

const Icon = ({ icon, className, beat }: Props) => (
  <i className={classNames('fa-solid', `fa-${icon}`, { 'fa-beat': !!beat }, className)} />
);
export default Icon;
