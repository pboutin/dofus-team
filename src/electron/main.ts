import 'reflect-metadata';
import { app } from 'electron';
import Store from 'electron-store';
import { container } from 'tsyringe';

import KeyboardShortcuts from './keyboard-shortcuts';
import InstantiatedCharacterRepository from './repositories/instantiated-character.repository';
import SettingsWindow from './windows/settings.window';
import DashboardWindow from './windows/dashboard.window';
import TeamRepository from './repositories/team.repository';
import SystemTray from './system-tray';
import DofusWindows from './dofus-windows';

const debug = process.argv[2] === 'debug';

export interface AppContext {
  debug: boolean;
}

app.on('ready', async () => {
  console.log(`Starting Dofus-Team in ${debug ? 'debug' : 'prod'} mode`);

  const store = new Store();

  container.registerInstance('store', store);
  container.registerInstance('appContext', { debug });

  const settingsWindow = container.resolve(SettingsWindow);
  const dashboardWindow = container.resolve(DashboardWindow);
  const instantiatedCharacterRepository = container.resolve(InstantiatedCharacterRepository);
  const teamsRepository = container.resolve(TeamRepository);

  // Initialize keyboard shortcuts
  container.resolve(KeyboardShortcuts);

  // Initialize system tray
  container.resolve(SystemTray);

  // Initialize DofusWindows handler
  container.resolve(DofusWindows);

  const configuredTeams = teamsRepository.fetchAll();
  if (configuredTeams.length === 0 || debug) {
    settingsWindow.open();
  } else {
    instantiatedCharacterRepository.instantiateTeam(configuredTeams[0].id);
  }

  dashboardWindow.open();
});
