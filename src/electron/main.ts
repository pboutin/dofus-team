import { app } from 'electron';

import { initializeStore } from './initializers/store';
import { initializeApi } from './initializers/api';
import { initializeKeyboard } from './initializers/keyboard';
import { initializeWindows } from './initializers/windows';
import { initializeTray } from './initializers/tray';
import { initializeDofusWindows } from './initializers/dofus-windows';

const debug = process.argv[2] === 'debug';

app.on('ready', async () => {
  console.log(`Starting Dofus-Team in ${debug ? 'debug' : 'prod'} mode`);

  const { repositories, instanciateTeam, hardReset } = initializeStore({ debug });

  const { subscribeWindow } = initializeApi({
    repositories,
    instanciateTeam,
  });

  initializeKeyboard({ repositories, instanciateTeam });

  const { openSettings, openDashboard, setAlwaysOnTop } = initializeWindows({
    debug,
    onOpenedCallbacks: [subscribeWindow],
  });

  initializeTray({
    debug,
    hardReset,
    openDashboard,
    openSettings,
    onAlwaysOnTopChange: setAlwaysOnTop,
    onClose: () => app.quit(),
  });

  initializeDofusWindows({ repositories, debug });

  const configuredTeams = repositories.teams.fetchAll();
  if (configuredTeams.length === 0) {
    openSettings();
  } else {
    instanciateTeam(configuredTeams[0].id);
  }

  openDashboard();
});
