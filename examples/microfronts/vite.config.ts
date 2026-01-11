import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";

const base = process.env.VITE_BASE ?? "./";

export default defineConfig({
  base,
  plugins: [
    react(),
    mvvmServiceDiPlugin(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "mobx", "mobx-react", "mobx-react-lite", "reflect-metadata"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  esbuild: {
    treeShaking: true,
    keepNames: true,
  },
});
