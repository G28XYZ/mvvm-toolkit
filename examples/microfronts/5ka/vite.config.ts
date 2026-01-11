import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";

const base = process.env.VITE_BASE ?? "./";
const rootDir = path.dirname(fileURLToPath(import.meta.url));

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
		outDir: "dist",
		sourcemap: true,
		cssCodeSplit: false,
		rollupOptions: {
			input: {
				app: path.resolve(rootDir, "index.html"),
				microfront: path.resolve(rootDir, "src/microfront.tsx")
			},
			output: {
				entryFileNames: (chunk) =>
					chunk.name === "microfront" ? "microfront.js" : "assets/[name]-[hash].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.names && assetInfo.names.some(name => name.endsWith(".css"))) {
						return "microfront.css";
					}
					return "assets/[name]-[hash][extname]";
				}
			}
		}
	},
	esbuild: {
		treeShaking: true,
		keepNames: true,
	},
});
