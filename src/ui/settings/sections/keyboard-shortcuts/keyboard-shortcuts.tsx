import { Action } from 'common/types';
import KeyboardShortcutRow from 'settings/sections/keyboard-shortcuts/keyboard-shortcut-row';
import React from 'react';
import useTranslate from 'hooks/use-translate';
import useKeyboardShortcuts from 'hooks/use-keyboard-shortcuts';
import useCharacters from 'hooks/use-characters';
import useTeams from 'hooks/use-teams';

const KeyboardShortcuts = () => {
  const translate = useTranslate('settings.shortcuts');
  const [keyboardShortcuts, {deleteKeyboardShortcut, updateKeyboardShortcut}] = useKeyboardShortcuts();
  const [characters] = useCharacters();
  const [teams] = useTeams();

  return (
    <>
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th colSpan={3}>{translate('current-team')}</th>
          </tr>
        </thead>
        <tbody>
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
            <KeyboardShortcutRow
              key={action}
              action={action}
              keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === action)?.keybind || ''}
              onKeybindChange={(newKeybind) => updateKeyboardShortcut({action, keybind: newKeybind})}
              onKeybindDelete={() => deleteKeyboardShortcut({action})}
            />
          ))}
        </tbody>
      </table>

      <table className="table table-compact w-full mt-2">
        <thead>
          <tr>
            <th colSpan={3}>{translate('characters')}</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character, index) => (
            <KeyboardShortcutRow
              key={character.id}
              action={Action.GOTO_CHARACTER}
              label={character.name}
              keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === Action.GOTO_CHARACTER && keyboardShortcut.argument === character.id)?.keybind || ''}
              onKeybindChange={(newKeybind) => updateKeyboardShortcut({action: Action.GOTO_CHARACTER, keybind: newKeybind, argument: character.id})}
              onKeybindDelete={() => deleteKeyboardShortcut({action: Action.GOTO_CHARACTER, argument: character.id})}
            />
          ))}
        </tbody>
      </table>

      <table className="table table-compact w-full mt-2">
        <thead>
          <tr>
            <th colSpan={3}>{translate('teams')}</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <KeyboardShortcutRow
              key={team.id}
              action={Action.SWITCH_TEAM}
              label={team.name}
              keybind={keyboardShortcuts.find(keyboardShortcut => keyboardShortcut.action === Action.SWITCH_TEAM && keyboardShortcut.argument === team.id)?.keybind || ''}
              onKeybindChange={(newKeybind) => updateKeyboardShortcut({action: Action.SWITCH_TEAM, keybind: newKeybind, argument: team.id})}
              onKeybindDelete={() => deleteKeyboardShortcut({action: Action.SWITCH_TEAM, argument: team.id})}
            />
          ))}
        </tbody>
      </table>
    </>
  )
};

export default KeyboardShortcuts;
