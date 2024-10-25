import classNames from 'classnames';
import React, { useRef } from 'react';
import { useClickAway, useToggle } from 'react-use';

import Icon from './icon';

interface Props {
  value: string;
  help?: string;
  onSelect: (server: string) => void;
  className?: string;
  disabled?: boolean;
}

const SERVER_OPTIONS = ['Draconiros', 'HellMina', 'Imagiro', 'Orukam', 'TalKasha', 'Tylezia', 'Ombre'];

const ServerSelector = ({ value, help, onSelect, className, disabled = false }: Props) => {
  const ref = useRef(null);
  const [isOpened, setIsOpened] = useToggle(false);
  useClickAway(ref, () => setIsOpened(false));

  const handleSelect = (server: string) => {
    setIsOpened(false);
    onSelect(server);
  };

  return (
    <div className={classNames(' flex flex-col', className)}>
      <div ref={ref} className={classNames('dropdown', { 'dropdown-open': isOpened })}>
        <button
          disabled={disabled}
          type="button"
          className="btn btn-secondary btn-sm w-full justify-start"
          onClick={setIsOpened}
        >
          <Icon icon="server" className="mr-2" />
          {value}
        </button>

        <ul className="menu dropdown-content z-40 mt-1 max-h-80 w-full flex-nowrap overflow-x-hidden overflow-y-scroll rounded-box bg-base-300 p-2 shadow">
          {SERVER_OPTIONS.map((server) => (
            <li key={server}>
              <a onClick={() => handleSelect(server)}>
                {value === server ? <Icon icon="check" className="mr-1" /> : null}
                {server}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {help && (
        <label className="label pb-0">
          <span className="label-text-alt">{help}</span>
        </label>
      )}
    </div>
  );
};

export default ServerSelector;
