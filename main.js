const { app, globalShortcut } = require("electron");
const API = require("./dofus-clients/active");

app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");

app.whenReady().then(() => {
  // Next character
  globalShortcut.register("F3", () => {
    const dofusWindows = API.listDofusWindows();
    
    if (dofusWindows.length === 0) {
      console.log("No Dofus window found");
      return;
    }

    const activeDofusCharacter = API.getActiveDofusCharacter();
    const activeDofusCharacterIndex = dofusWindows.findIndex(
      (dofusWindow) => dofusWindow.character === activeDofusCharacter
    );
    const nextDofusWindow =
      dofusWindows[(activeDofusCharacterIndex + 1) % dofusWindows.length];

      API.focusDofusWindowName(nextDofusWindow.windowName);
  });

  // Previous character
  globalShortcut.register("F4", () => {
    const dofusWindows = API.listDofusWindows();
    if (dofusWindows.length === 0) {
      console.log("No Dofus window found");
      return;
    }

    const activeDofusCharacter = API.getActiveDofusCharacter();
    const activeDofusWindowIndex = dofusWindows.findIndex(
      (dofusWindow) => dofusWindow.character === activeDofusCharacter
    );
    const previousDofusWindow =
      dofusWindows[
        (activeDofusWindowIndex - 1 + dofusWindows.length) % dofusWindows.length
      ];

      API.focusDofusWindowName(previousDofusWindow.windowName);
  });

  // Goto 1 to 8
  for (let i = 0; i < 8; i++) {
    // +5 in order to start at F5
    globalShortcut.register(`F${i + 5}`, () => {
      const dofusWindows = API.listDofusWindows();
      if (dofusWindows.length <= i) {
        console.log("No Dofus window found");
        return;
      }

      API.focusDofusWindowName(dofusWindows[i].windowName);
    });
  }

  console.log("Dofus Team shortcuts registered");
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
