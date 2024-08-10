const koffi = require('koffi');

const user32 = koffi.load('user32.dll');

const FindWindowA = user32.func('__stdcall', 'FindWindowA', 'int', ['str', 'str']);

const SwitchToThisWindow = user32.func('__stdcall', 'SwitchToThisWindow', 'void', ['int', 'bool']);

const WNDENUMPROC = koffi.proto('bool __stdcall WNDENUMPROC(void *hwnd, intptr_t lparam)');
const EnumWindows = user32.func('bool EnumWindows(WNDENUMPROC *func, intptr_t lparam)');

const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);
const GetWindowText = user32.func('int __stdcall GetWindowTextA(HWND hWnd, _Out_ uint8_t *lpString, int nMaxCount)');

const listDofusWindows = () => {
  const dofusClients = [];

  EnumWindows((hwnd, lparam) => {
    let buf = Buffer.allocUnsafe(1024);
    GetWindowText(hwnd, buf, buf.length);
    const windowName = koffi.decode(buf, 'char', 100);

    const match = windowName.match(/(.+) - Dofus 2\./);
    if (match) {
      dofusClients.push({
        windowName,
        character: match[1],
      });
    }
    return true;
  }, 100);

  return dofusClients;
};

const focusDofusWindow = (characterToFocus) => {
  const dofusWindows = listDofusWindows();

  const characterWindow = dofusWindows.find(({ character }) => character === characterToFocus);
  if (!characterWindow) return;

  const hwnd = FindWindowA(null, characterWindow.windowName);
  SwitchToThisWindow(hwnd, false);
};

module.exports = { listDofusWindows, focusDofusWindow };
