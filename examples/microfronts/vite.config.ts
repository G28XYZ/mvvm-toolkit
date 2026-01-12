import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE ?? "./";
  const isFederationBuild =
    env.VITE_MICROFRONT_MODE === "federation" || mode === "federation";

  const resolveFederationBase = (value: string) => {
    if (!value) return "/";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//")) {
      return value;
    }
    if (value.startsWith("/")) return value;
    return "/";
  };

  const withBase = (path: string) => {
    const normalized = base.endsWith("/") ? base : `${base}/`;
    return `${normalized}${path.replace(/^\//, "")}`;
  };
  const federationBase = resolveFederationBase(base);
  const withFederationBase = (path: string) => {
    const normalized = federationBase.endsWith("/") ? federationBase : `${federationBase}/`;
    return `${normalized}${path.replace(/^\//, "")}`;
  };
  const federationRemotes = {
    mf5ka:
      env.VITE_FEDERATION_5KA_URL ??
      withFederationBase("./microfronts/5ka-microfront/assets/remoteEntry.js"),
    mfauchan:
      env.VITE_FEDERATION_AUCHAN_URL ??
      withFederationBase("./microfronts/auchan-microfront/assets/remoteEntry.js"),
  };
  const external = isFederationBuild ? [] : ["mf5ka/microfront", "mfauchan/microfront"];

  return {
    base,
    plugins: [
      react(),
      mvvmServiceDiPlugin(),
      ...(isFederationBuild
        ? [
            federation({
              name: "microfronts-host",
              remotes: federationRemotes,
              shared: ["react", "react-dom"],
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
