/// <reference types="vite/client" />

declare module "mf5ka/microfront" {
  export type Microfront = {
    id: string;
    title: string;
    description?: string;
    mount: (element: HTMLElement) => void | (() => void);
  };
  export const microfront: Microfront;
  const microfrontDefault: Microfront;
  export default microfrontDefault;
}

declare module "mfauchan/microfront" {
  export type Microfront = {
    id: string;
    title: string;
    description?: string;
    mount: (element: HTMLElement) => void | (() => void);
  };
  export const microfront: Microfront;
  const microfrontDefault: Microfront;
  export default microfrontDefault;
}

interface ImportMetaEnv {
  readonly VITE_MICROFRONT_MODE?: string;
  readonly VITE_FEDERATION_5KA_URL?: string;
  readonly VITE_FEDERATION_AUCHAN_URL?: string;
}
