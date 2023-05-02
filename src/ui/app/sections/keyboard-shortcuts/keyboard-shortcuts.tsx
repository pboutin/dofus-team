import { Action } from 'common/types';
import KeyboardShortcut from 'components/keyboard-shortcut';
import React from 'react';
import useTranslate from 'hooks/use-translate';
import useKeyboardShortcuts from 'hooks/use-keyboard-shortcuts';

const KeyboardShortcuts = () => {
  const translate = useTranslate('app.shortcuts');
  const [keyboardShortcuts, {deleteKeyboardShortcut, updateKeyboardShortcut}] = useKeyboardShortcuts();


  return (
    <div className='prose'>
      <h2>{translate('current-team')}</h2>

      {[
        Action.GOTO_PREVIOUS,
        Action.GOTO_NEXT,
        Action.GOTO_1,
        Action.GOTO_2,
        Action.GOTO_3,
        Action.GOTO_4,
        Action.GOTO_5,
        Action.GOTO_6,
        Action.GOTO_7,
        Action.GOTO_8,
      ].map((action) => (
        <KeyboardShortcut
          key={action}
          action={action}
          keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === action)?.keybind || ''}
          onKeybindChange={(newKeybind) => updateKeyboardShortcut({action, keybind: newKeybind})}
          onKeybindDelete={() => deleteKeyboardShortcut({action})}
        />  
      ))}

      <h2>{translate('characters')}</h2>

      <h2>{translate('teams')}</h2>
    </div>
  )
};

export default KeyboardShortcuts;