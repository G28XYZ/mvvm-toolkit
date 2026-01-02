import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { defineMetadata, getOwnMetadata } from "../utils";
import { GetService, Inject, Service, type IServiceOptions } from "../typedi";
import type { Model } from "../model";

const STORE_METADATA_KEY = Symbol("store-key");

export type StoreDevtoolsOptions = {
  name?: string;
  enabled?: boolean;
  instanceId?: string;
};

export type ApplyLoadedOptions<T> = {
  model?: new (...args: any) => T;
  mode?: "replace" | "append";
  cash?: boolean;
};

export interface IStoreOptions extends IServiceOptions {
  devtools?: StoreDevtoolsOptions;
}

type StoreItemSnapshot = {
  name: string;
  data: any;
  historyIndex: number;
};

type StoreStateSnapshot = {
  items: StoreItemSnapshot[];
};

type DevtoolsMessage = {
  type: string;
  payload?: { type?: string };
  state?: string;
};

type DevtoolsConnection = {
  init(state: any): void;
  send(action: any, state: any): void;
  subscribe(listener: (message: DevtoolsMessage) => void): (() => void) | void;
  unsubscribe?: () => void;
  disconnect?: () => void;
};

type DevtoolsExtension = {
  connect(options?: { name?: string; instanceId?: string }): DevtoolsConnection;
};

const getDevtools = (): DevtoolsExtension | null => {
  const globalAny = globalThis as unknown as { __REDUX_DEVTOOLS_EXTENSION__?: DevtoolsExtension };
  return globalAny.__REDUX_DEVTOOLS_EXTENSION__ ?? null;
};

const getDevtoolsApplyDepth = () => {
  const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_APPLYING__?: number };
  return globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 0;
};

const withDevtoolsApplying = <T>(fn: () => T): T => {
  const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_APPLYING__?: number };
  globalAny.__MVVM_DEVTOOLS_APPLYING__ = (globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 0) + 1;
  try {
    return fn();
  } finally {
    globalAny.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, (globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 1) - 1);
  }
};

const isDevtoolsApplying = () => getDevtoolsApplyDepth() > 0;

const getStoreState = (store: StoreBase<any>): StoreStateSnapshot => ({
  items: store.items.map((item) => ({
    name: item.constructor?.name ?? "Model",
    data: item.service.dumpData,
    historyIndex: item.service.historyIndex,
  })),
});

type ModelCtor = new (...args: any[]) => Model;

const isStoreStateSnapshot = (value: unknown): value is StoreStateSnapshot => {
  return Boolean(value && typeof value === "object" && Array.isArray((value as StoreStateSnapshot).items));
};

const parseStoreState = (state?: string): StoreStateSnapshot | null => {
  if (!state) return null;
  try {
    const parsed = JSON.parse(state);
    return isStoreStateSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const attachStoreDevtools = (store: StoreBase<any>, options: StoreDevtoolsOptions = {}) => {
  const devtools = getDevtools();
  if (!devtools) return () => {};

  const connection = devtools.connect({ name: options.name, instanceId: options.instanceId });
  let isApplyingDevtools = false;
  let lastItemCtor = (store.items[0]?.constructor as ModelCtor | undefined) ?? null;
  try {
    connection.init(getStoreState(store));
  } catch {
    // ignore init errors
  }

  const disposeReaction = reaction(
    () => getStoreState(store),
    (state) => {
      if (isApplyingDevtools || isDevtoolsApplying()) return;
      const currentCtor = store.items[0]?.constructor as ModelCtor | undefined;
      if (currentCtor) lastItemCtor = currentCtor;
      try {
        connection.send({ type: "store:update" }, state);
      } catch {
        // ignore send errors
      }
    }
  );

  const applyFromDevtools = <T>(fn: () => T): T => {
    isApplyingDevtools = true;
    return withDevtoolsApplying(() => {
      try {
        return fn();
      } finally {
        isApplyingDevtools = false;
      }
    });
  };

  const unsubscribe = connection.subscribe((message) => {
    if (message.type !== "DISPATCH") return;

    const actionType = message.payload?.type;
    if (actionType === "RESET" || actionType === "ROLLBACK") {
      applyFromDevtools(() => store.reset());
      return;
    }

    if (actionType === "JUMP_TO_ACTION" || actionType === "JUMP_TO_STATE") {
      const snapshot = parseStoreState(message.state);
      if (!snapshot) return;

      applyFromDevtools(() => {
        const canUpdateInPlace =
          snapshot.items.length === store.items.length &&
          store.items.every(
            (item) =>
              typeof (item as any)?.service?.goToHistory === "function" ||
              typeof (item as any)?.service?.loadData === "function"
          );

        if (canUpdateInPlace) {
          runInAction(() => {
            snapshot.items.forEach((item, index) => {
              const service = (store.items[index] as any)?.service;
              const historyIndex = item.historyIndex;
              const history = service?.history;
              const hasHistory = Array.isArray(history) && history.length > 0;
              const canGoToHistory =
                hasHistory &&
                typeof historyIndex === "number" &&
                typeof service?.goToHistory === "function" &&
                ((historyIndex === -1 && history.length > 0) || historyIndex < history.length);

              if (canGoToHistory) {
                service.goToHistory(historyIndex);
                return;
              }

              if (typeof service?.loadData === "function") {
                service.loadData(item.data);
              }
            });
          });
          return;
        }

        const ctor = (store.items[0]?.constructor as ModelCtor | undefined) ?? lastItemCtor;
        const itemsData = snapshot.items.map((item) => item.data);
        if (ctor) {
          store.applyLoaded(itemsData, { model: ctor, cash: false });
          lastItemCtor = ctor;
          return;
        }

        store.applyLoaded(itemsData, { cash: false });
        const updatedCtor = store.items[0]?.constructor as ModelCtor | undefined;
        if (updatedCtor) lastItemCtor = updatedCtor;
      });
    }
  });

  return () => {
    disposeReaction();
    if (typeof unsubscribe === "function") unsubscribe();
    if (typeof connection.unsubscribe === "function") connection.unsubscribe();
    if (typeof connection.disconnect === "function") connection.disconnect();
  };
};

export class StoreBase<T extends Model = Model> {
  @observable accessor items: T[] = [];
  @observable protected accessor _cash: unknown[] = [];

  constructor() {
    makeObservable(this);
    this.autoAttachDevtools();
  }

  @action add(item: T) {
    this.items = [...this.items, item];
  }

  @action remove(item: T) {
    this.items = this.items.filter((current) => current !== item);
  }

  /**
   * Найти элемент по предикату.
   */
  find(predicate: (item: T, index: number, items: T[]) => boolean) {
    return this.items.find(predicate);
  }

  /**
   * Отфильтровать элементы по предикату.
   */
  filter(predicate: (item: T, index: number, items: T[]) => boolean) {
    return this.items.filter(predicate);
  }

  /**
   * Найти элемент по id (или любому полю-ключу).
   */
  findBy<K extends keyof T>(key: K, value: T[K]) {
    return this.items.find((item) => item?.[key] === value);
  }

  @action clear() {
    this.items = [];
  }

  @computed get size() {
    return this.items.length;
  }

  @computed get snapshot() {
    return getStoreState(this);
  }

  /**
   * Оригинальные данные (до маппинга в модели).
   */
  @computed get cash() {
    return this._cash;
  }

  @action reset() {
    this.clear();
  }

  /**
   * Применить загруженные данные к items.
   */
  @action applyLoaded(items: any[], options: ApplyLoadedOptions<T> = {}) {
    const { model, mode = "replace", cash = true } = options;
    if (cash) this.setCash(items);
    if (mode === "append") {
      this.items = [...this.items, ...[model ? items.map((el) => new model(el)) : items].flat(1)];
      return;
    }
    this.items = model ? items.map((el) => new model(el)) : items;
  }

  /**
   * Сохранить оригинальные данные стора.
   */
  @action setCash(data: unknown[]) {
    this._cash = data ?? [];
  }

  private autoAttachDevtools() {
    const globalAny = globalThis as unknown as {
      __MVVM_DEVTOOLS_AUTO__?: boolean;
      __MVVM_DEVTOOLS_STORE_SEQ__?: number;
    };
    if (!globalAny.__MVVM_DEVTOOLS_AUTO__) return;

    const options = getOwnMetadata<unknown, Partial<IStoreOptions>>(STORE_METADATA_KEY, this.constructor, {}) || {};
    if (options.devtools?.enabled === false) return;

    const name = options.devtools?.name ?? this.constructor?.name ?? "Store";
    const seq = (globalAny.__MVVM_DEVTOOLS_STORE_SEQ__ ?? 0) + 1;
    globalAny.__MVVM_DEVTOOLS_STORE_SEQ__ = seq;
    const instanceId = options.devtools?.instanceId ?? `${name}#${seq}`;
    attachStoreDevtools(this, { name, instanceId });
  }
}

/**
 * Получить только Store-сервис по имени или классу.
 */
export interface DiStores {}

export type InjectStoreType<K extends keyof DiStores = keyof DiStores> = InstanceType<DiStores[K]>;

export function GetStore<K extends keyof DiStores>(storeName: K): InjectStoreType<K>;
export function GetStore<T extends DiStores[keyof DiStores]>(storeName: T): InstanceType<T>;
export function GetStore<T extends new (...args: any[]) => any>(storeName: T): InstanceType<T>;
export function GetStore(storeName: string): unknown;
export function GetStore<T extends new (...args: any[]) => any>(
  storeName: string | T
): InstanceType<T> | unknown {
  return GetService(storeName as any, "instance") as InstanceType<T>;
}

export function InjectStore<This, T>(storeName: string | T): (...args: any[]) => any;
export function InjectStore<This, K extends keyof DiStores>(
  storeName: K
): (t: undefined, c: ClassFieldDecoratorContext<This, InjectStoreType<K>>) => void;
export function InjectStore<This, K extends keyof DiStores>(
  storeName: K
): (t: ClassAccessorDecoratorTarget<This, InjectStoreType<K>>, c: ClassAccessorDecoratorContext<This, InjectStoreType<K>>) => ClassAccessorDecoratorTarget<This, InjectStoreType<K>> | void;
export function InjectStore<This, T extends DiStores[keyof DiStores]>(
  storeName: T
): (t: undefined, c: ClassFieldDecoratorContext<This, InstanceType<T>>) => void;
export function InjectStore<This, T extends DiStores[keyof DiStores]>(
  storeName: T
): (t: ClassAccessorDecoratorTarget<This, InstanceType<T>>, c: ClassAccessorDecoratorContext<This, InstanceType<T>>) => ClassAccessorDecoratorTarget<This, InstanceType<T>> | void;
export function InjectStore<This, T>(storeName: string | T): (target: object, propertyKey: string | symbol) => void;
export function InjectStore<This, T>(storeName: string | T) {
  return ((t: any, c: any) => (Inject(storeName as string | T) as any)(t, c)) as any;
}

export function Store<This, Args extends any[]>(
  options?: string | IStoreOptions
): (t: new (...args: Args) => This, ctx?: ClassDecoratorContext<new (...args: Args) => This>) => void;
export function Store<This, Args extends any[]>(
  t: new (...args: Args) => This,
  ctx: ClassDecoratorContext<new (...args: Args) => This>
): void;
export function Store<This, Args extends any[]>(t: new (...args: Args) => This): void | (new (...args: Args) => This);
export function Store<This, Args extends any[]>(
  options?: string | IStoreOptions | (new (...args: Args) => This),
  ctx?: ClassDecoratorContext<new (...args: Args) => This>
): void | (new (...args: Args) => This) | ((t: new (...args: Args) => This, ctx?: ClassDecoratorContext<new (...args: Args) => This>) => void) {
  const define = (t: new (...args: Args) => This, ctx: ClassDecoratorContext<new (...args: Args) => This>) => {
    const storeOptions: IStoreOptions =
      typeof options === "string"
        ? { id: options }
        : typeof options === "object"
          ? options
          : { id: ctx?.name ?? t?.name };

    defineMetadata(STORE_METADATA_KEY, storeOptions, t);
    Service(storeOptions)(t, ctx);
  };

  if (typeof options === "function") return define(options, ctx as any);

  return (t: new (...args: Args) => This, ctx?: ClassDecoratorContext<new (...args: Args) => This>) =>
    define(t, ctx as any);
}
