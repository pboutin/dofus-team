const electron = require('electron');
const {ipcRenderer, remote} = electron;

const render = dofusInstances => {
    let buttons = document.getElementsByTagName('button');
    while (buttons.length) {
        buttons[0].parentElement.removeChild(buttons[0]);
    }

    const container = document.getElementById('container');
    dofusInstances.forEach(dofusInstance => {
        let button = document.createElement('button');

        button.textContent = dofusInstance.name;
        button.id = dofusInstance.name;

        if (! dofusInstance.isEnabled) {
            button.classList.add('disabled');
        }

        button.onclick = () => {
            ipcRenderer.send('instanceSelect', dofusInstance);
        };
        button.oncontextmenu = () => {
            ipcRenderer.send('instanceToggle', dofusInstance);
        };
        container.appendChild(button);
    });
};

ipcRenderer.on('renderInstances', (event, dofusInstances) => render(dofusInstances));

ipcRenderer.on('activeInstanceChange', (event, dofusInstance) => {
    var elements = document.getElementsByClassName('active');

    while (elements.length) {
        elements[0].classList.remove('active');
    }
    document.getElementById(dofusInstance.name).classList.add('active');
});

document.getElementById('configure').onclick = () => {
    ipcRenderer.send('openConfig');
};

render(remote.getGlobal('dofusInstances'));

