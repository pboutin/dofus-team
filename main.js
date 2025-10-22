const { app, globalShortcut } = require("electron");
const dofusWindows = require("./dofus-clients/active");

app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");

app.whenReady().then(() => {
  // Next character
  globalShortcut.register("F3", () => {
    const characters = dofusWindows.listDofusWindows();
    if (characters.length === 0) {
      console.log("No characters found");
      return;
    }

    const activeCharacter = dofusWindows.getActiveDofusWindow();
    const activeCharacterIndex = characters.findIndex(
      (character) => character === activeCharacter
    );
    const nextCharacter =
      characters[(activeCharacterIndex + 1) % characters.length];

    dofusWindows.focusDofusWindow(nextCharacter);
  });

  // Previous character
  globalShortcut.register("F4", () => {
    const characters = dofusWindows.listDofusWindows();
    if (characters.length === 0) {
      console.log("No characters found");
      return;
    }

    const activeCharacter = dofusWindows.getActiveDofusWindow();
    const activeCharacterIndex = characters.findIndex(
      (character) => character === activeCharacter
    );
    const previousCharacter =
      characters[
        (activeCharacterIndex - 1 + characters.length) % characters.length
      ];

    dofusWindows.focusDofusWindow(previousCharacter);
  });

  // Goto 1 to 8
  for (let i = 0; i < 8; i++) {
    // +5 in order to start at F5
    globalShortcut.register(`F${i + 5}`, () => {
      const characters = dofusWindows.listDofusWindows();
      if (characters.length <= i) {
        console.log("No character found");
        return;
      }

      const character = characters[i];
      dofusWindows.focusDofusWindow(character);
    });
  }

  console.log("Dofus Team shortcuts registered");
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
