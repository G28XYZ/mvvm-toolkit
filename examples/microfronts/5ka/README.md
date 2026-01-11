# rvm-toolkit Todo example

Small GitHub Pages-ready demo that shows how to use rvm-toolkit with a Todo list
plus a full API showcase (decorators, Model.service, StoreBase, DI, and utils).

## Setup

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

The static site is generated in `dist`.

If you deploy to a repo named `my-repo`, update `base` in `vite.config.ts` to:

```ts
base: "/my-repo/"
```

For relative paths everywhere, keep `base: "./"` and publish the `dist` folder.
