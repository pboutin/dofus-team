const listDofusWindows = () => {
  return [
    { windowName: "Stub One", character: "Stub One" },
    { windowName: "Stub Two", character: "Stub Two" },
    { windowName: "Stub Three", character: "Stub Three" },
  ];
};

const focusDofusWindowName = (windowName) => {
  console.log(`Focus "${windowName}" called`);
};

const getActiveDofusCharacter = () => {
  return "Stub One";
};

module.exports = {
  listDofusWindows,
  focusDofusWindowName,
  getActiveDofusCharacter,
};
