import React, { useRef, useState } from 'react';
import { Action, KeyboardShortcut } from 'common/types';
import { useClickAway, useToggle } from 'react-use';
import Icon from 'components/icon';
import useTranslate from 'hooks/use-translate';
import classNames from 'classnames';

const KEYBIND_MAX_LENGTH = 3;

const ELECTRON_TO_DISPLAY = {
  CommandOrControl: 'Ctrl',
  Up: '↑',
  Down: '↓',
  Left: '←',
  Right: '→',
};

interface Props {
  label?: string;
  action: Action;
  keybind: string;
  onKeybindChange: (keybind: string) => void;
  onKeybindDelete: () => void;
}

const KeyboardShortcut = ({ label, action, keybind, onKeybindChange, onKeybindDelete }: Props) => {
  const translate = useTranslate('components.keyboard-shortcut');
  const [isRecording, setIsRecording] = useToggle(false);
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const ref = useRef(null);

  const teardown = () => {
    setIsRecording(false);
    setRecordedKeys([]);
  };

  useClickAway(ref, teardown);

  return (
    <div className="flex gap-2 items-center justify-between" ref={ref}>
      <div className="flex gap-2 items-center">
        <div className="text-base" style={{minWidth: 300}}>
          {label || translate(action)}
        </div>

        {isRecording && <Icon icon='keyboard' beat />}

        {(isRecording ? recordedKeys : keybind.split('+').filter(Boolean)).map((key, index) => (
          <div key={key + index} className="flex gap-2 items-center">
            {index > 0 && <span className="text-gray-400">+</span>}
            <kbd className="kbd kbd-sm">{ELECTRON_TO_DISPLAY[key] || key}</kbd>
          </div>
        ))}

        {(!isRecording && !keybind) && (
          <div className="badge">
            {translate('not-set')}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={classNames('btn btn-sm btn-circle btn-secondary', {'opacity-0': isRecording})}
          onFocus={() => setIsRecording(true)}
          onKeyDown={(e) => {
            e.preventDefault();
            setRecordedKeys((keys) => [...keys, e.key].slice(0, KEYBIND_MAX_LENGTH));
          }}
        >
          <Icon icon='edit' />
        </button>

        {(!isRecording && keybind) && (
          <button
            type="button"
            className="btn btn-sm btn-circle btn-error"
            onClick={onKeybindDelete}
          >
            <Icon icon='trash' />
          </button>
        )}

        {(isRecording && recordedKeys.length > 0) && (
          <button
            type="button"
            className="btn btn-sm btn-circle btn-primary ml-4"
            onClick={() => {
              onKeybindChange(recordedKeys.join('+'));
              teardown();
            }}
          >
            <Icon icon='check' />
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={teardown}
          >
            <Icon icon='times' />
          </button>
        )}
      </div>
    </div>
  );
};

export default KeyboardShortcut;
