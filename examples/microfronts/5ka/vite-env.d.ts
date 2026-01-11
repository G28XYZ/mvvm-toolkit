/// <reference types="vite/client" />

declare module "*.module.css?url" {
  const src: string;
  export default src;
}
