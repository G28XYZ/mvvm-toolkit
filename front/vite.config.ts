import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties'],
        },
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: 'tsconfig.json',
    },
  },
  esbuild: {
    keepNames: true,
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: false, // TODO - включить если будет собирать без ошибок (иногда ошибки в не соответствии неймингов функций/методов, undefined при вызове)
  },
});
