export type MicrofrontKey = "5ka-microfront" | "auchan-microfront";

export type MicrofrontRegistryItem = {
  key: MicrofrontKey;
  remote: string; // mf5ka, mfauchan
  remoteUrl: string;
  defaultRemoteEntryPath: string;

  importers: {
    packages: () => Promise<any>;
    federation: () => Promise<any>;
  };
};

export const MICROFRONTS: Record<MicrofrontKey, MicrofrontRegistryItem> = {
  "5ka-microfront": {
    key: "5ka-microfront",
    remote: "mf5ka",
    remoteUrl: "http://localhost:5175/remoteEntry.js",
    defaultRemoteEntryPath: "microfront/5ka-microfront/remoteEntry.js",
    importers: {
      packages: () => import("mf5ka/microfront"),
      federation: () => import("mf5ka/microfront"),
    },
  },
  "auchan-microfront": {
    key: "auchan-microfront",
    remote: "mfauchan",
    remoteUrl: "http://localhost:5174/remoteEntry.js",
    defaultRemoteEntryPath: "microfront/auchan-microfront/remoteEntry.js",
    importers: {
      packages: () => import("mfauchan/microfront"),
      federation: () => import("mfauchan/microfront"),
    },
  },
};
