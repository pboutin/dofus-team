import { KeyboardShortcut } from 'common/types';
import { useEffect, useState } from 'react';

const ipcRenderer = window.require("electron").ipcRenderer;

type Hook = [
  KeyboardShortcut[],
  {
    deleteKeyboardShortcut: (keyboardShortcut: Omit<KeyboardShortcut, 'keybind'>) => void;
    updateKeyboardShortcut: (keyboardShortcut: KeyboardShortcut) => void;
  }
];

export default function useKeyboardShortcuts(): Hook {
  const [keyboardShortcuts, setKeyboardShortcuts] = useState<KeyboardShortcut[]>([]);

  const handleKeyboardShortcutsChange = (event, keyboardShortcuts: KeyboardShortcut[]) => {
    setKeyboardShortcuts(keyboardShortcuts);
  };

  useEffect(() => {
    ipcRenderer.invoke('getKeyboardShortcuts').then(setKeyboardShortcuts);
    ipcRenderer.on('keyboardShortcutsChanged', handleKeyboardShortcutsChange);

    return () => {
      ipcRenderer.removeListener('keyboardShortcutsChanged', handleKeyboardShortcutsChange);
    };
  }, []);

  return [
    keyboardShortcuts,
    {
      deleteKeyboardShortcut: (keyboardShortcut: Omit<KeyboardShortcut, 'keybind'>) => {
        ipcRenderer.invoke('deleteKeyboardShortcut', keyboardShortcut);
      },
      updateKeyboardShortcut: (keyboardShortcut: KeyboardShortcut) => {
        ipcRenderer.invoke('updateKeyboardShortcut', keyboardShortcut);
      }
    }
  ];
}
