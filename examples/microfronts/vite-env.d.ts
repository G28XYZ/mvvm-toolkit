/// <reference types="vite/client" />

declare module "5ka-microfront" {
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

declare module "auchan-microfront" {
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
