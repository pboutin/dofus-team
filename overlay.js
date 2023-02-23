const { ipcRenderer } = require('electron');

function updateState(characters) {
  characters.forEach((character) => {
    const memberElement = document.getElementById(character.name);
    memberElement.classList.toggle('active', character.active);
    memberElement.classList.toggle('main', character.main);
    memberElement.classList.toggle('disabled', character.disabled);
  });
}

ipcRenderer.on('initialize', (_, characters) => {
  const mainElement = document.getElementById('main');

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




// const OpenOptionsButtonElement = document.getElementById('open-options-button');
// OpenOptionsButtonElement.onclick = () => {
//   ipcRenderer.send('open-options');
// }
