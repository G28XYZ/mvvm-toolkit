export type MicrofrontDefinition = {
  id: string;
  title: string;
  description?: string;
  mount: (element: HTMLElement) => void | (() => void);
};

export type MicrofrontModule = {
  microfront?: MicrofrontDefinition;
  default?: MicrofrontDefinition;
};

export type MicrofrontRecord = {
  id: string;
  packageName: string;
  title: string;
  description?: string;
  mount: (element: HTMLElement) => void | (() => void);
  origin: string;
};