const electron = require('electron');
const {ipcRenderer, remote} = electron;

const instancesInput = document.getElementById('instances-input');
const instancesButton = document.getElementById('instances-save');

instancesButton.onclick = () => {
    ipcRenderer.send('dofusInstancesUpdate', instancesInput.value.split('\n').filter(line => !! line));
};

instancesInput.value = remote.getGlobal('dofusInstances').join('\n');