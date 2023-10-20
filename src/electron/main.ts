import { app } from "electron";

import { initializeStore } from "./initializers/store";
import { initializeApi } from "./initializers/api";
import { initializeKeyboard } from "./initializers/keyboard";
import { initializeWindows } from "./initializers/windows";
import { initializeTray } from "./initializers/tray";
import { initializeDofusWindows } from "./initializers/dofus-windows";

const debug = process.argv[2] === "debug";

app.on("ready", async () => {
  console.log(`Starting Dofus-Team in ${debug ? "debug" : "prod"} mode`);

  const { repositories, repositoriesService } = initializeStore({ debug });
  const { subscribeWindow } = initializeApi({ repositories });
  // initializeKeyboard({ repositories, repositoriesService });
  const { openSettings } = initializeWindows({
    debug,
    onOpenedCallbacks: [subscribeWindow],
  });
  initializeTray({
    onOpenSettings: openSettings,
    onClose: () => app.quit(),
  });
  initializeDofusWindows({ repositories, debug });

  openSettings();
});
