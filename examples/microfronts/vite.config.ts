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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE ?? "./";

  // ✅ у тебя в примере местами пропали "||"
  const microfrontMode = resolveMode(env.VITE_MICROFRONT_MODE ?? mode);
  const isFederationBuild = microfrontMode === "federation";

  // базовый префикс где лежат remoteEntry, если надо:
  const federationBase = env.VITE_FEDERATION_BASE ?? base;

  const remotes = Object.fromEntries(
    Object.values(MICROFRONTS).map((mf) => {
      const envKey = `VITE_FEDERATION_${mf.remote.toUpperCase()}_URL`; // VITE_FEDERATION_MF5KA_URL и т.п.
      const url =
        (env as any)[envKey] ?? joinBase(federationBase, mf.defaultRemoteEntryPath);
      return [mf.remote, url];
    })
  );

  console.log(remotes);

  const external = isFederationBuild
    ? []
    : Object.values(MICROFRONTS).map((mf) => `${mf.remote}/${mf.exposedModule}`);

  return {
    base,
    plugins: [
      react(),
      mvvmServiceDiPlugin(),
      ...(isFederationBuild
        ? [
            federation({
              name: "microfronts-host",
              remotes,
            }),
          ]
        : []),
    ],
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