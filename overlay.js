const { ipcRenderer } = require('electron');

function updateState(activeTeamCharacters) {
  activeTeamCharacters.forEach((character) => {
    const memberElement = document.getElementById(character.name);
    memberElement.classList.toggle('active', character.active);
    memberElement.classList.toggle('main', character.main);
    memberElement.classList.toggle('disabled', character.disabled);
  });
}

ipcRenderer.on('initialize', (_, {activeTeamCharacters, positionLocked}) => {
  document.getElementById('drag').classList.toggle('locked', positionLocked);

  const mainElement = document.getElementById('main');
  mainElement.innerHTML = '';

  activeTeamCharacters.forEach((character) => {
    const memberElement = document.createElement('img');
    memberElement.src = character.avatar;
    memberElement.id = character.name;
  
    mainElement.append(memberElement);
  });

  updateState(activeTeamCharacters);
});

ipcRenderer.on('refresh', (_, activeTeamCharacters) => updateState(activeTeamCharacters));

ipcRenderer.on('overlay-lock', () => {
  document.getElementById('drag').classList.toggle('locked', true);
});

ipcRenderer.on('overlay-unlock', () => {
  document.getElementById('drag').classList.toggle('locked', false);
});
