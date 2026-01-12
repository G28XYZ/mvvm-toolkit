import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";
import { MICROFRONTS } from "./src/microfronts.registry";

type MicrofrontMode = "packages" | "federation";

const resolveMode = (value: unknown): MicrofrontMode =>
  String(value ?? "").trim().toLowerCase() === "federation" ? "federation" : "packages";

const joinBase = (base: string, p: string) => {
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${p.replace(/^\//, "")}`;
};

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE ?? "./";
  const shared = {
    react: { singleton: true },
    "react-dom": { singleton: true },
  };

  // ✅ у тебя в примере местами пропали "||"
  const microfrontMode = resolveMode(env.VITE_MICROFRONT_MODE ?? mode);
  const isFederationBuild = microfrontMode === "federation";

  // базовый префикс где лежат remoteEntry, если надо:
  const federationBase = env.VITE_FEDERATION_BASE ?? base;
  const useDevRemotes = command === "serve" && !env.VITE_FEDERATION_BASE;

  const remotes = Object.fromEntries(
    Object.values(MICROFRONTS).map((mf) => {
      const envKey = `VITE_FEDERATION_${mf.remote.toUpperCase()}_URL`;
      const legacyEnvKey = `VITE_FEDERATION_${mf.remote.replace(/^mf/i, "").toUpperCase()}_URL`;
      const envUrl = env[envKey] ?? env[legacyEnvKey];
      const url =
        envUrl ??
        (useDevRemotes ? mf.remoteUrl : undefined) ??
        joinBase(federationBase, mf.defaultRemoteEntryPath);
      return [
        mf.remote,
        {
          type: "module",
          name: mf.remote,
          entry: url,
          shareScope: "default",
        },
      ];
    })
  );

  console.log(remotes);

  const external = isFederationBuild
    ? []
    : Object.values(MICROFRONTS).map((mf) => `${mf.remote}/${mf.exposedModule}`);

  const plugins = [
      react(),
      mvvmServiceDiPlugin(),
  ];

  isFederationBuild &&
  plugins.push(
    federation({
          remotes,
          shared,
          name   : "microfronts-host",
          exposes: { "./shared": "./src/main.tsx" },
        })
    )

  return {
    base,
    plugins: plugins,
    resolve: {
      dedupe: ["react", "react-dom", "mobx", "mobx-react", "mobx-react-lite", "reflect-metadata"],
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: external.length ? { external } : undefined,
    },
    esbuild: {
      treeShaking: true,
      keepNames: true,
    },
  };
});
