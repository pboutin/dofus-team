import { app } from 'electron';
import { updateElectronApp } from 'update-electron-app';

import CharacterAvatars from './electron/character-avatars';
import DofusWindows from './electron/dofus-windows';
import KeyboardShortcuts from './electron/keyboard-shortcuts';
import CharacterRepository from './electron/repositories/character.repository';
import ConfigRepository from './electron/repositories/config.repository';
import InstantiatedCharacterRepository from './electron/repositories/instantiated-character.repository';
import KeyboardShortcutRepository from './electron/repositories/keyboard-shortcut.repository';
import TeamRepository from './electron/repositories/team.repository';
import DashboardWindow from './electron/windows/dashboard.window';
import SettingsWindow from './electron/windows/settings.window';

updateElectronApp();

app.on('ready', async () => {
  // eslint-disable-next-line no-console
  console.log('Starting Dofus-Team');

  const characterRepository = new CharacterRepository();
  const teamRepository = new TeamRepository();
  const keyboardShortcutRepository = new KeyboardShortcutRepository();
  const instantiatedCharacterRepository = new InstantiatedCharacterRepository(teamRepository, characterRepository);
  const configRepository = new ConfigRepository();

  const modelRepositories = [
    characterRepository,
    teamRepository,
    keyboardShortcutRepository,
    instantiatedCharacterRepository,
  ];

  // Initialize DofusWindows handler
  new DofusWindows(instantiatedCharacterRepository);

  // Initialize avatar handler
  const characterAvatars = new CharacterAvatars();

  const settingsWindow = new SettingsWindow(modelRepositories, configRepository, characterAvatars);
  const dashboardWindow = new DashboardWindow(modelRepositories, configRepository, characterAvatars);

  // Initialize keyboard shortcuts
  new KeyboardShortcuts(instantiatedCharacterRepository, keyboardShortcutRepository);

  const instantiatedCharacters = instantiatedCharacterRepository.fetchAll();

  if (!instantiatedCharacters.length) {
    const configuredTeams = teamRepository.fetchAll();
    if (configuredTeams.length === 0) {
      settingsWindow.open();
    } else {
      instantiatedCharacterRepository.instantiateTeam(configuredTeams[0].id);
    }
  }

  dashboardWindow.open();
});
