import koffi from 'koffi';

const user32 = koffi.load('user32.dll');

const FindWindowA = user32.func('__stdcall', 'FindWindowA', 'int', ['str', 'str']);
const GetForegroundWindow = user32.func('__stdcall', 'GetForegroundWindow', 'int', []);

const SwitchToThisWindow = user32.func('__stdcall', 'SwitchToThisWindow', 'void', ['int', 'bool']);

const WNDENUMPROC = koffi.proto('bool __stdcall WNDENUMPROC(void *hwnd, intptr_t lparam)');
const EnumWindows = user32.func('bool EnumWindows(WNDENUMPROC *func, intptr_t lparam)');

const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);
const GetWindowText = user32.func('int __stdcall GetWindowTextA(HWND hWnd, _Out_ uint8_t *lpString, int nMaxCount)');
const GetClassName = user32.func('int __stdcall GetClassNameA(HWND hWnd, _Out_ uint8_t *lpString, int nMaxCount)');

const DOFUS_WINDOW_NAME_REGEX = /(.+) - (Dofus )?2\./;

const listDofusWindows = () => {
  const dofusClients = [];

  EnumWindows((hwnd, lparam) => {
    let windowNameBuffer = Buffer.allocUnsafe(1024);
    GetWindowText(hwnd, windowNameBuffer, windowNameBuffer.length);
    const windowName = koffi.decode(windowNameBuffer, 'char', 100);

    let windowClassBuffer = Buffer.allocUnsafe(1024);
    GetClassName(hwnd, windowClassBuffer, windowClassBuffer.length);
    const windowClass = koffi.decode(windowClassBuffer, 'char', 100);

    const match = windowName.match(DOFUS_WINDOW_NAME_REGEX);
    if (!match) return true;

    if (
      ![
        'ApolloRuntimeContentWindow', // Dofus 2 (flash)
        'UnityWndClass', // Dofus 2 (unity)
      ].includes(windowClass)
    ) {
      return true;
    }

    dofusClients.push({
      windowName,
      character: match[1],
    });
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

const getActiveDofusWindow = () => {
  const hwnd = GetForegroundWindow();

  let windowNameBuffer = Buffer.allocUnsafe(1024);
  GetWindowText(hwnd, windowNameBuffer, windowNameBuffer.length);
  const windowName = koffi.decode(windowNameBuffer, 'char', 100);

  const match = windowName.match(DOFUS_WINDOW_NAME_REGEX);
  if (!match) return null;

  return match[1];
};

export default { listDofusWindows, focusDofusWindow, getActiveDofusWindow };
