var ffi = require('ffi-napi')

var user32 = new ffi.Library('user32', {
    'GetTopWindow': ['long', ['long']],
    'FindWindowA': ['long', ['string', 'string']],
    'SetActiveWindow': ['long', ['long']],
    'SetForegroundWindow': ['bool', ['long']],
    'BringWindowToTop': ['bool', ['long']],
    'ShowWindow': ['bool', ['long', 'int']],
    'SwitchToThisWindow': ['void', ['long', 'bool']],
    'GetForegroundWindow': ['long', []],
    'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
    'GetWindowThreadProcessId': ['int', ['long', 'int']],
    'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
    'SetFocus': ['long', ['long']]
});

var winToSetOnTop = user32.FindWindowA(null, "Infah - Dofus 2.66.3.16")
console.log(winToSetOnTop);
user32.SwitchToThisWindow(winToSetOnTop, 3);
// user32.SetForegroundWindow(winToSetOnTop);

/*var foregroundHWnd = user32.GetForegroundWindow()
var currentThreadId = kernel32.GetCurrentThreadId()
var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)

var setWindowPos1 = user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
var setWindowPos2 = user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
var attachThreadInput = user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
var setFocus = user32.SetFocus(winToSetOnTop)
var setActiveWindow = user32.SetActiveWindow(winToSetOnTop)*/
