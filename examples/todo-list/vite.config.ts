import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mvvmServiceDiPlugin } from 'mvvm-toolkit/vite-plugins/mvvm-di';

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
let base = "./";
if (repoName) {
	base = repoName.endsWith(".github.io") ? "/" : `/${repoName}/`;
}

export default defineConfig({
  base,
  plugins: [
		mvvmServiceDiPlugin(),
		react(),
	],
	resolve: {
		dedupe: ["react", "react-dom", "mobx", "mobx-react", "mobx-react-lite", "reflect-metadata"],
	},
	build: {
		outDir: 'dist',
		sourcemap: true
	},
	esbuild: {
		treeShaking: true,
		keepNames: true,
	},
});
