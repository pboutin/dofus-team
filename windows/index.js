const electron = require('electron');
const {ipcRenderer, remote} = electron;

const container = document.getElementById('container');

remote.getGlobal('dofusInstances').forEach((dofusInstance, index) => {
    let button = document.createElement('button');
    button.textContent = dofusInstance;
    button.id = dofusInstance;
    if (index === 0) {
        button.classList.add('active');
    }
    button.onclick = () => {
        ipcRenderer.send('instanceSelect', dofusInstance);
    };
    container.appendChild(button);
});

ipcRenderer.on('instanceChange', (event, dofusInstance) => {
    var elements = document.getElementsByClassName('active');

    while (elements.length) {
        elements[0].classList.remove('active');
    }
    document.getElementById(dofusInstance).classList.add('active');
});

let resizeEventTask;
window.addEventListener('resize', () => {
    clearTimeout(resizeEventTask);
    resizeEventTask = setTimeout(() => {
        ipcRenderer.send('windowResize', {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        });
    }, 1000);
});

document.getElementById('configure').onclick = () => {
    ipcRenderer.send('openConfig');
};


