import classNames from 'classnames';
import React from 'react';

interface Props {
  icon: string;
  className?: string;
}

const Icon = ({ icon, className }: Props) => (
  <i className={classNames('fa-solid', `fa-${icon}`, className)} />
);
export default Icon;
