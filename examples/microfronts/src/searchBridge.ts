import { GetService } from 'rvm-toolkit';

export type SearchBridge = {
  getQuery: () => string;
  setQuery: (value: string) => void;
  submit: () => void;
  onQuery: (listener: (value: string) => void) => () => void;
  onSubmit: (listener: () => void) => () => void;
};

declare global {
  interface Window {
    __microfrontSearch?: SearchBridge;
  }
}

let query = "";
const queryListeners = new Set<(value: string) => void>();
const submitListeners = new Set<() => void>();

const searchBridge: SearchBridge = {
  getQuery: () => query,
  setQuery: (value: string) => {
    if (value === query) return;
    query = value;
    for (const listener of queryListeners) {
      listener(query);
    }
  },
  submit: () => {
    for (const listener of submitListeners) {
      listener();
    }
  },
  onQuery: (listener: (value: string) => void) => {
    queryListeners.add(listener);
    return () => {
      queryListeners.delete(listener);
    };
  },
  onSubmit: (listener: () => void) => {
    submitListeners.add(listener);
    return () => {
      submitListeners.delete(listener);
    };
  },
};

if (typeof window !== "undefined") {
  console.log(GetService('auchan:ProductStore'));
  window.__microfrontSearch = searchBridge;
}

export { searchBridge };
