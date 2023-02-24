const ffi = require('ffi-napi')

const user32 = new ffi.Library('user32', {
  'FindWindowA': ['long', ['string', 'string']],
  'SwitchToThisWindow': ['void', ['long', 'bool']]
});

module.exports = (windowName) => {
  var winToSetOnTop = user32.FindWindowA(null, windowName)
  user32.SwitchToThisWindow(winToSetOnTop, 3);
};
