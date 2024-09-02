import { app } from 'electron';
import Store from 'electron-store';

import SettingsWindow from './electron/windows/settings.window';
import DofusWindows from './electron/dofus-windows';
import KeyboardShortcuts from './electron/keyboard-shortcuts';
import InstantiatedCharacterRepository from './electron/repositories/instantiated-character.repository';
import TeamRepository from './electron/repositories/team.repository';
import DashboardWindow from './electron/windows/dashboard.window';
import CharacterRepository from './electron/repositories/character.repository';
import KeyboardShortcutRepository from './electron/repositories/keyboard-shortcut.repository';
import ConfigRepository from './electron/repositories/config.repository';

app.on('ready', async () => {
  console.log('Starting Dofus-Team');

  const store = new Store();

  const characterRepository = new CharacterRepository(store);
  const teamRepository = new TeamRepository(store);
  const keyboardShortcutRepository = new KeyboardShortcutRepository(store);
  const instantiatedCharacterRepository = new InstantiatedCharacterRepository(
    store,
    teamRepository,
    characterRepository,
  );
  const configRepository = new ConfigRepository(store);

  const everyRepositories = [
    characterRepository,
    teamRepository,
    keyboardShortcutRepository,
    instantiatedCharacterRepository,
    configRepository,
  ];

  const settingsWindow = new SettingsWindow(everyRepositories);
  const dashboardWindow = new DashboardWindow(everyRepositories);

  // Initialize keyboard shortcuts
  new KeyboardShortcuts(instantiatedCharacterRepository, keyboardShortcutRepository);

  // Initialize DofusWindows handler
  new DofusWindows(instantiatedCharacterRepository);

  const configuredTeams = teamRepository.fetchAll();
  if (configuredTeams.length === 0) {
    settingsWindow.open();
  } else {
    instantiatedCharacterRepository.instantiateTeam(configuredTeams[0].id);
  }

  dashboardWindow.open();
});
