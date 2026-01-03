import { attachModelDevtools, Model } from "mvvm-toolkit";

const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_AUTO__?: boolean };
const isDev = '__REDUX_DEVTOOLS_EXTENSION__' in globalAny;
console.log(isDev);
globalAny.__MVVM_DEVTOOLS_AUTO__ = isDev;

export const attachModelDevtoolsIfDev = <T>(model: Model<T>, name?: string) => {
  if (!isDev) return () => {};
  return attachModelDevtools(model, { name });
};
