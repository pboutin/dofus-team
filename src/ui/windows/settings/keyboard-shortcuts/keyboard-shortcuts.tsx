import React from 'react';

import { Action } from '../../../../types';
import CharacterAvatar from '../../../components/character-avatar';
import { useKeyboardShortcuts, useTeams, useCharacters } from '../../../hooks/use-ipc-renderer';
import useTranslate from '../../../hooks/use-translate';
import KeyboardShortcutRow from '../../../windows/settings/keyboard-shortcuts/keyboard-shortcut-row';

const KeyboardShortcuts = () => {
  const translate = useTranslate('settings.shortcuts');
  const { items: keyboardShortcuts, destroy, upsert } = useKeyboardShortcuts();
  const { items: characters } = useCharacters();
  const { items: teams } = useTeams();

  return (
    <>
      <table className=" table w-full">
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
          ].map((action) => {
            const existingKeyboardShortcut = keyboardShortcuts.find(
              (keyboardShortcut) => keyboardShortcut.action === action,
            );

            return (
              <KeyboardShortcutRow
                key={action}
                action={action}
                keybind={existingKeyboardShortcut?.keybind}
                onKeybindChange={(newKeybind) =>
                  upsert({
                    id: existingKeyboardShortcut?.id,
                    action,
                    keybind: newKeybind,
                  })
                }
                onKeybindDelete={() => destroy(existingKeyboardShortcut.id)}
              />
            );
          })}
        </tbody>
      </table>

      {characters.length > 0 && (
        <table className=" table mt-2 w-full">
          <thead>
            <tr>
              <th colSpan={3}>{translate('characters')}</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => {
              const existingKeyboardShortcut = keyboardShortcuts.find(
                (keyboardShortcut) =>
                  keyboardShortcut.action === Action.GOTO_CHARACTER && keyboardShortcut.argument === character.id,
              );

              return (
                <KeyboardShortcutRow
                  key={character.id}
                  action={Action.GOTO_CHARACTER}
                  keybind={existingKeyboardShortcut?.keybind}
                  onKeybindChange={(newKeybind) =>
                    upsert({
                      id: existingKeyboardShortcut?.id,
                      action: Action.GOTO_CHARACTER,
                      keybind: newKeybind,
                      argument: character.id,
                    })
                  }
                  onKeybindDelete={() => destroy(existingKeyboardShortcut.id)}
                >
                  <div className="flex items-center gap-2">
                    <CharacterAvatar character={character} compact />
                    {character.name}
                  </div>
                </KeyboardShortcutRow>
              );
            })}
          </tbody>
        </table>
      )}

      {teams.length > 0 && (
        <table className=" table mt-2 w-full">
          <thead>
            <tr>
              <th colSpan={3}>{translate('teams')}</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const existingKeyboardShortcut = keyboardShortcuts.find(
                (keyboardShortcut) =>
                  keyboardShortcut.action === Action.SWITCH_TEAM && keyboardShortcut.argument === team.id,
              );

              return (
                <KeyboardShortcutRow
                  key={team.id}
                  action={Action.SWITCH_TEAM}
                  keybind={
                    keyboardShortcuts.find(
                      (keyboardShortcut) =>
                        keyboardShortcut.action === Action.SWITCH_TEAM && keyboardShortcut.argument === team.id,
                    )?.keybind || ''
                  }
                  onKeybindChange={(newKeybind) =>
                    upsert({
                      id: existingKeyboardShortcut?.id,
                      action: Action.SWITCH_TEAM,
                      keybind: newKeybind,
                      argument: team.id,
                    })
                  }
                  onKeybindDelete={() => destroy(existingKeyboardShortcut.id)}
                >
                  {team.name}
                </KeyboardShortcutRow>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default KeyboardShortcuts;
