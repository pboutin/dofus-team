import { Action } from 'common/types';
import KeyboardShortcut from 'components/keyboard-shortcut';
import React from 'react';
import useTranslate from 'hooks/use-translate';
import useKeyboardShortcuts from 'hooks/use-keyboard-shortcuts';
import useCharacters from 'hooks/use-characters';
import useTeams from 'hooks/use-teams';

const KeyboardShortcuts = () => {
  const translate = useTranslate('app.shortcuts');
  const [keyboardShortcuts, {deleteKeyboardShortcut, updateKeyboardShortcut}] = useKeyboardShortcuts();
  const [characters] = useCharacters();
  const [teams] = useTeams();

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
        ].map((action, index) => (
          <>
            {index > 0 && <hr className='my-2 opacity-50'/>}

            <KeyboardShortcut
              key={action}
              action={action}
              keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === action)?.keybind || ''}
              onKeybindChange={(newKeybind) => updateKeyboardShortcut({action, keybind: newKeybind})}
              onKeybindDelete={() => deleteKeyboardShortcut({action})}
            />
          </>
        ))}

      <h2>{translate('characters')}</h2>

      {characters.map((character, index) => (
        <>
          {index > 0 && <hr className='my-2 opacity-50'/>}

          <KeyboardShortcut
            key={character.id}
            action={Action.GOTO_CHARACTER}
            label={character.name}
            keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === Action.GOTO_CHARACTER && keyboardShortcut.argument === character.id)?.keybind || ''}
            onKeybindChange={(newKeybind) => updateKeyboardShortcut({action: Action.GOTO_CHARACTER, keybind: newKeybind, argument: character.id})}
            onKeybindDelete={() => deleteKeyboardShortcut({action: Action.GOTO_CHARACTER, argument: character.id})}
          />
        </>
      ))}

      <h2>{translate('teams')}</h2>

      {teams.map((team, index) => (
        <>
          {index > 0 && <hr className='my-2 opacity-50'/>}
          
          <KeyboardShortcut
            key={team.id}
            action={Action.SWITCH_TEAM}
            label={team.name}
            keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === Action.SWITCH_TEAM && keyboardShortcut.argument === team.id)?.keybind || ''}
            onKeybindChange={(newKeybind) => updateKeyboardShortcut({action: Action.SWITCH_TEAM, keybind: newKeybind, argument: team.id})}
            onKeybindDelete={() => deleteKeyboardShortcut({action: Action.SWITCH_TEAM, argument: team.id})}
          />
        </>
      ))}
    </div>
  )
};

export default KeyboardShortcuts;
