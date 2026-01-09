import { action, computed, makeObservable, observable } from "mobx";
import { GetService, Inject, Service, type IServiceOptions } from "../typedi";
import type { Model } from "../model";

export type ApplyLoadedOptions<T> = {
  model?: new (...args: any) => T;
  mode?: "replace" | "append";
  cash?: boolean;
};

export interface IStoreOptions extends IServiceOptions {
}

type StoreItemSnapshot = {
  name: string;
  data: any;
};

type StoreStateSnapshot = {
  items: StoreItemSnapshot[];
};

const getStoreState = (store: StoreBase<any>): StoreStateSnapshot => ({
  items: store.items.map((item) => ({
    name: item.constructor?.name ?? "Model",
    data: item.service.dumpData,
  })),
});

export class StoreBase<T extends Model = Model> {
  @observable accessor items: T[] = [];
  @observable protected accessor _cash: unknown[] = [];

  constructor() {
    makeObservable(this);
  }

  @action add(item: T) {
    this.items.push(item)
  }

  @action addMany(items: T[]) {
    if (!items?.length) return;
    this.items = this.items.concat(items);
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
      const resolved = model ? items.map((el) => new model(el)) : items;
      this.addMany(resolved);
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

    Service(storeOptions)(t, ctx);
  };

  if (typeof options === "function") return define(options, ctx as any);

  return (t: new (...args: Args) => This, ctx?: ClassDecoratorContext<new (...args: Args) => This>) =>
    define(t, ctx as any);
}
