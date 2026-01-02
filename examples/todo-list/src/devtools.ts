import { attachModelDevtools, Model } from "mvvm-toolkit";

const isDev = true;
const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_AUTO__?: boolean };
globalAny.__MVVM_DEVTOOLS_AUTO__ = isDev;

export const attachModelDevtoolsIfDev = <T>(model: Model<T>, name?: string) => {
  if (!isDev) return () => {};
  return attachModelDevtools(model, { name });
};
