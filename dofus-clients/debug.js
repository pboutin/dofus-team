const listDofusWindows = () => {
  return ["Stub One", "Stub Two", "Stub Three"];
};

const focusDofusWindow = (characterToFocus) => {
  console.log(`Focus "${characterToFocus}" called`);
};

const getActiveDofusWindow = () => {
  return "Stub One";
};

module.exports = { listDofusWindows, focusDofusWindow, getActiveDofusWindow };
