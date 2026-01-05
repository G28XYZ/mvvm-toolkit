import { attachModelDevtools, Model } from "rvm-toolkit";

const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_AUTO__?: boolean };
const isDev = false && '__REDUX_DEVTOOLS_EXTENSION__' in globalAny;
globalAny.__MVVM_DEVTOOLS_AUTO__ = isDev;

export const attachModelDevtoolsIfDev = <T>(model: Model<T>, name?: string) => {
  if (!isDev) return () => {};
  return attachModelDevtools(model, { name });
};
