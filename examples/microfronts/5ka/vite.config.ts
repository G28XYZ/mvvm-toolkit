import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {federation} from "@module-federation/vite";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE ?? "./";
  const isFederationBuild = env.VITE_MICROFRONT_MODE === "federation" || mode === "federation";
  const shared = {
    react: { singleton: true },
    "react-dom": { singleton: true },
  };

  const plugins = [
      mvvmServiceDiPlugin(),
      react(),
    ]
  
    isFederationBuild && plugins.push(
      federation({
                name: "mf5ka",
                filename: "remoteEntry.js",
                exposes: {
                  "./microfront": "./src/microfront.tsx"
                },
                shared,
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
      cssCodeSplit: false,
      rollupOptions: {
        input: isFederationBuild
          ? {
              app: path.resolve(rootDir, "index.html"),
            }
          : {
              app       : path.resolve(rootDir, "index.html"),
              microfront: path.resolve(rootDir, "src/microfront.tsx")
            },
        output: {
          entryFileNames: (chunk) => {
            if (!isFederationBuild && chunk.name === "microfront") return "microfront.js";
            if (chunk.name === "remoteEntry") return "remoteEntry.js";
            return "assets/[name]-[hash].js";
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) return "microfront.css";
            return "assets/[name]-[hash][extname]";
          }
        }
      }
    },
    esbuild: {
      treeShaking: true,
      keepNames: true,
    },
    server: {
      port: 5175
    }
  };
});
