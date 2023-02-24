const { ipcRenderer } = require('electron');

function updateState(characters) {
  characters.forEach((character) => {
    const memberElement = document.getElementById(character.name);
    memberElement.classList.toggle('active', character.active);
    memberElement.classList.toggle('main', character.main);
    memberElement.classList.toggle('disabled', character.disabled);
  });
}


ipcRenderer.on('initialize', (_, {teamState: characters, positionLocked}) => {
  document.getElementById('drag').classList.toggle('locked', positionLocked);

  const mainElement = document.getElementById('main');
  mainElement.innerHTML = '';

  characters.forEach((character) => {
    const memberElement = document.createElement('img');
    memberElement.src = character.avatar;
    memberElement.id = character.name;
    
    memberElement.onmouseup = (event) => {
      if (event.button === 0) {
        ipcRenderer.send('switch', character.name);
      } else if (event.button === 2) {
        ipcRenderer.send('disable-toggle', character.name);
      }
    };
  
    mainElement.append(memberElement);
  });

  updateState(characters);
});

ipcRenderer.on('refresh', (_, characters) => updateState(characters));

ipcRenderer.on('position-locked-update', (_, positionLocked) => {
  document.getElementById('drag').classList.toggle('locked', positionLocked);
});
