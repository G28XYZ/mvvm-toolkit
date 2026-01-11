import { action, observable } from "mobx";
import {
  Inject,
  InjectStore,
  type InjectStoreType,
  type InjectType,
  flowCommand,
  MakeObservable,
  Service,
  ViewModel,
} from "rvm-toolkit";
import { servicePrefix } from "./utils";

type SearchBridge = {
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

const getExternalSearchBridge = (): SearchBridge | null => {
  if (typeof window === "undefined") return null;
  const bridge = window.__microfrontSearch;
  if (!bridge) return null;
  if (typeof bridge.onQuery !== "function" || typeof bridge.onSubmit !== "function") return null;
  return bridge as SearchBridge;
};

@Service({ id: `${servicePrefix}:SearchVM` })
@MakeObservable
export class SearchVM extends ViewModel {
  @InjectStore("auchan:ProductStore") store: InjectStoreType<"auchan:ProductStore">;

  // родительская VM хранит query, чтобы его можно было показывать/использовать на экране
  @Inject("auchan:ProductVM") parent: InjectType<"auchan:ProductVM">;

  @Inject("auchan:Api") api: InjectType<'auchan:Api'>;

  @observable hasExternalSearch = Boolean(getExternalSearchBridge());

  private externalDisposers: Array<() => void> = [];

  private async *_search() {
    await this.store.search(this.parent.query);
  }

  search = flowCommand(() => this._search(), {
    canExecute: ({ state, states }) => this.parent.query.trim().length > 0 && state === states.ready,
  });

  @action.bound updateQuery(value: string) {
    this.parent.setQuery(value);
  }

  @action.bound setHasExternalSearch(value: boolean) {
    this.hasExternalSearch = value;
  }

  @action.bound clear() {
    this.parent.setQuery("");
  }

  onInit() {
    const bridge = getExternalSearchBridge();
    if (!bridge) return;

    this.setHasExternalSearch(true);
    this.parent.setQuery(bridge.getQuery());

    this.externalDisposers.push(
      bridge.onQuery((value) => {
        this.parent.setQuery(value);
      })
    );

    this.externalDisposers.push(
      bridge.onSubmit(() => {
        this.search.execute();
      })
    );
  }

  onDispose() {
    for (const dispose of this.externalDisposers) {
      dispose();
    }
    this.externalDisposers = [];
    this.setHasExternalSearch(false);
  }
}
