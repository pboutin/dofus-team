import { app } from 'electron';
import Store from 'electron-store';

import DofusWindows from './electron/dofus-windows';
import KeyboardShortcuts from './electron/keyboard-shortcuts';
import CharacterRepository from './electron/repositories/character.repository';
import ConfigRepository from './electron/repositories/config.repository';
import InstantiatedCharacterRepository from './electron/repositories/instantiated-character.repository';
import KeyboardShortcutRepository from './electron/repositories/keyboard-shortcut.repository';
import TeamRepository from './electron/repositories/team.repository';
import DashboardWindow from './electron/windows/dashboard.window';
import SettingsWindow from './electron/windows/settings.window';

app.on('ready', async () => {
  // eslint-disable-next-line no-console
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

  const modelRepositories = [
    characterRepository,
    teamRepository,
    keyboardShortcutRepository,
    instantiatedCharacterRepository,
  ];

  // Initialize DofusWindows handler
  new DofusWindows(instantiatedCharacterRepository);

  const settingsWindow = new SettingsWindow(modelRepositories, configRepository);
  const dashboardWindow = new DashboardWindow(modelRepositories, configRepository);

  // Initialize keyboard shortcuts
  new KeyboardShortcuts(instantiatedCharacterRepository, keyboardShortcutRepository);

  const configuredTeams = teamRepository.fetchAll();
  if (configuredTeams.length === 0) {
    settingsWindow.open();
  } else {
    instantiatedCharacterRepository.instantiateTeam(configuredTeams[0].id);
  }

  dashboardWindow.open();
});
