import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useClickAway, useToggle } from 'react-use';

import { Action, KeyboardShortcut as KeyboardShortcutRow } from '../../../../types';
import Icon from '../../../components/icon';
import useTranslate from '../../../hooks/use-translate';

const KEYBIND_MAX_LENGTH = 3;

const ELECTRON_TO_DISPLAY: Record<string, string> = {
  CommandOrControl: 'Ctrl',
  Up: '↑',
  Down: '↓',
  Left: '←',
  Right: '→',
};

interface Props {
  children?: React.ReactNode;
  action: Action;
  keybind?: string;
  onKeybindChange: (keybind: string) => void;
  onKeybindDelete: () => void;
}

const KeyboardShortcutRow = ({ children, action, keybind, onKeybindChange, onKeybindDelete }: Props) => {
  const translate = useTranslate('components.keyboard-shortcut');
  const [isRecording, setIsRecording] = useToggle(false);
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const ref = useRef(null);

  const teardown = () => {
    setIsRecording(false);
    setRecordedKeys([]);
  };

  useClickAway(ref, teardown);

  const displayedKeys = isRecording ? recordedKeys : (keybind ?? '').split('+').filter(Boolean);

  return (
    <tr className="group hover" ref={ref}>
      <td className="w-1/3">{children ?? translate(action)}</td>

      <td>
        {isRecording && <Icon icon="keyboard" className="mr-2" beat />}

        {!!displayedKeys.length && (
          <div className="inline-flex items-center gap-2">
            {displayedKeys.map((key, index) => (
              <div key={`${key}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">+</span>}
                <kbd className="kbd kbd-sm">{ELECTRON_TO_DISPLAY[key] || key}</kbd>
              </div>
            ))}
          </div>
        )}

        {!isRecording && !keybind && <div className="badge">{translate('not-set')}</div>}
      </td>

      <td>
        <div
          className={classNames('flex justify-end gap-2', {
            'opacity-0 group-hover:opacity-100': !isRecording,
          })}
        >
          <button
            type="button"
            className={classNames('btn btn-sm btn-circle btn-secondary', {
              'opacity-0': isRecording,
            })}
            onFocus={() => setIsRecording(true)}
            onKeyDown={(e) => {
              e.preventDefault();
              setRecordedKeys((keys) => [...keys, e.key].slice(0, KEYBIND_MAX_LENGTH));
            }}
          >
            <Icon icon="edit" />
          </button>

          {!isRecording && keybind && (
            <button type="button" className="btn btn-circle btn-error btn-sm" onClick={onKeybindDelete}>
              <Icon icon="trash" />
            </button>
          )}

          {isRecording && recordedKeys.length > 0 && (
            <button
              type="button"
              className="btn btn-circle btn-primary btn-sm ml-4"
              onClick={() => {
                onKeybindChange(recordedKeys.join('+'));
                teardown();
              }}
            >
              <Icon icon="check" />
            </button>
          )}

          {isRecording && (
            <button type="button" className="btn btn-circle btn-ghost btn-sm" onClick={teardown}>
              <Icon icon="times" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default KeyboardShortcutRow;
