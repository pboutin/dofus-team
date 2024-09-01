import '@abraham/reflection';
import { app } from 'electron';
import Store from 'electron-store';
import { container } from 'tsyringe';

import SettingsWindow from './electron/windows/settings.window';
import DofusWindows from './electron/dofus-windows';
import KeyboardShortcuts from './electron/keyboard-shortcuts';
import InstantiatedCharacterRepository from './electron/repositories/instantiated-character.repository';
import TeamRepository from './electron/repositories/team.repository';
import SystemTray from './electron/system-tray';
import DashboardWindow from './electron/windows/dashboard.window';

app.on('ready', async () => {
  console.log('Starting Dofus-Team');

  const store = new Store();

  container.registerInstance('store', store);

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
  if (configuredTeams.length === 0) {
    settingsWindow.open();
  } else {
    instantiatedCharacterRepository.instantiateTeam(configuredTeams[0].id);
  }

  dashboardWindow.open();
});
