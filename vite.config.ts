import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import Inspect from "vite-plugin-inspect";
import checker from "vite-plugin-checker";

export default defineConfig((env) => ({
  plugins: [
    Inspect(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint .",
      },
    }),
  ],
  build: {
    emptyOutDir: true,
    manifest: true,
    reportCompressedSize: true,
    minify: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src", "index.ts"),
        "vite-plugins/mvvm-di": path.resolve(__dirname, "src", "vite-plugins", "mvvm-di.ts"),
      },
      name: "mvvm-tools",
      fileName: (format, entryName) => {
        if (entryName === "index") return `index.${format === "cjs" ? "cjs" : "js"}`;
        return `${entryName}.${format === "cjs" ? "cjs" : "js"}`;
      },
      formats: ["es", "cjs"],
    },
    sourcemap: Boolean(env.mode === "develop"),
    rollupOptions: {
      external: [
        "react",
        "mobx",
        "react-dom",
        "immer",
        "mobx-react",
        "lodash",
        "reflect-metadata",
        "core-js",
        "typescript",
        "node:fs/promises",
        "node:path",
      ],
      plugins: [
        // typescriptPaths({
        //   preserveExtensions: true,
        // }),
        typescript({
          sourceMap: Boolean(env.mode === "develop"),
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
}));
