import classNames from 'classnames';
import React from 'react';

interface Props {
  value: string;
  label: string;
  placeholder?: string;
  help?: string;
  className?: string;
  onChange: (value: string) => void;
}

const Input = ({ value, label, placeholder, className, help, onChange }: Props) => (
  <div className={classNames('form-control w-full', className)}>
    <label className="label pt-0">
      <span className="label-text">{label}</span>
    </label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      className="input input-sm input-bordered input-secondary w-full"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
    />
    {help && (
      <label className="label pb-0">
        <span className="label-text-alt">{help}</span>
      </label>
    )}
  </div>
);

export default Input;
