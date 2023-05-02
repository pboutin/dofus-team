import React, { useRef, useState } from 'react';
import { Action, KeyboardShortcut } from 'common/types';
import { useClickAway, useToggle } from 'react-use';
import Icon from 'components/icon';
import useTranslate from 'hooks/use-translate';

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
  const translate = useTranslate('components.keyboard-shortcuts');
  const [isRecording, setIsRecording] = useToggle(false);
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const ref = useRef(null);

  const teardown = () => {
    setIsRecording(false);
    setRecordedKeys([]);
  };

  useClickAway(ref, teardown);

  return (
    <div className="flex gap-2 items-center" ref={ref}>
      <div className="text-base">{label || translate(action)}</div>

      <div className="flex gap-2 items-center">
        {(isRecording ? recordedKeys : keybind.split('+').filter(Boolean)).map((key, index) => (
          <div key={key + index} className="flex gap-2 items-center">
            {index > 0 && <span className="text-gray-400">+</span>}
            <kbd className="kbd kbd-sm">{ELECTRON_TO_DISPLAY[key] || key}</kbd>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-sm btn-square btn-secondary"
        onFocus={() => setIsRecording(true)}
        onKeyDown={(e) => {
          e.preventDefault();
          setRecordedKeys((keys) => [...keys, e.key]);
        }}
      >
        {isRecording ? <Icon icon='keyboard' beat /> : <Icon icon='edit' />}
      </button>

      {(!isRecording && keybind) && (
        <button
          type="button"
          className="btn btn-sm btn-square btn-error"
          onClick={onKeybindDelete}
        >
          <Icon icon='trash' />
        </button>
      )}

      {(isRecording && recordedKeys.length > 0) && (
        <button
          type="button"
          className="btn btn-sm btn-square btn-primary ml-4"
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
          className="btn btn-sm btn-square btn-ghost"
          onClick={teardown}
        >
          <Icon icon='times' />
        </button>
      )}
    </div>
  );
};

export default KeyboardShortcut;
