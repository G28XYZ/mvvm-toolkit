import { type IServiceOptions } from "../typedi";
import type { Model } from "../model";
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
export declare const attachStoreDevtools: (store: StoreBase<any>, options?: StoreDevtoolsOptions) => () => void;
export declare class StoreBase<T extends Model = Model> {
    accessor items: T[];
    protected accessor _cash: unknown[];
    constructor();
    add(item: T): void;
    addMany(items: T[]): void;
    remove(item: T): void;
    /**
     * Найти элемент по предикату.
     */
    find(predicate: (item: T, index: number, items: T[]) => boolean): T;
    /**
     * Отфильтровать элементы по предикату.
     */
    filter(predicate: (item: T, index: number, items: T[]) => boolean): T[];
    /**
     * Найти элемент по id (или любому полю-ключу).
     */
    findBy<K extends keyof T>(key: K, value: T[K]): T;
    clear(): void;
    get size(): number;
    get snapshot(): StoreStateSnapshot;
    /**
     * Оригинальные данные (до маппинга в модели).
     */
    get cash(): unknown[];
    reset(): void;
    /**
     * Применить загруженные данные к items.
     */
    applyLoaded(items: any[], options?: ApplyLoadedOptions<T>): void;
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(data: unknown[]): void;
    private autoAttachDevtools;
}
/**
 * Получить только Store-сервис по имени или классу.
 */
export interface DiStores {
}
export type InjectStoreType<K extends keyof DiStores = keyof DiStores> = InstanceType<DiStores[K]>;
export declare function GetStore<K extends keyof DiStores>(storeName: K): InjectStoreType<K>;
export declare function GetStore<T extends DiStores[keyof DiStores]>(storeName: T): InstanceType<T>;
export declare function GetStore<T extends new (...args: any[]) => any>(storeName: T): InstanceType<T>;
export declare function GetStore(storeName: string): unknown;
export declare function InjectStore<This, T>(storeName: string | T): (...args: any[]) => any;
export declare function InjectStore<This, K extends keyof DiStores>(storeName: K): (t: undefined, c: ClassFieldDecoratorContext<This, InjectStoreType<K>>) => void;
export declare function InjectStore<This, K extends keyof DiStores>(storeName: K): (t: ClassAccessorDecoratorTarget<This, InjectStoreType<K>>, c: ClassAccessorDecoratorContext<This, InjectStoreType<K>>) => ClassAccessorDecoratorTarget<This, InjectStoreType<K>> | void;
export declare function InjectStore<This, T extends DiStores[keyof DiStores]>(storeName: T): (t: undefined, c: ClassFieldDecoratorContext<This, InstanceType<T>>) => void;
export declare function InjectStore<This, T extends DiStores[keyof DiStores]>(storeName: T): (t: ClassAccessorDecoratorTarget<This, InstanceType<T>>, c: ClassAccessorDecoratorContext<This, InstanceType<T>>) => ClassAccessorDecoratorTarget<This, InstanceType<T>> | void;
export declare function InjectStore<This, T>(storeName: string | T): (target: object, propertyKey: string | symbol) => void;
export declare function Store<This, Args extends any[]>(options?: string | IStoreOptions): (t: new (...args: Args) => This, ctx?: ClassDecoratorContext<new (...args: Args) => This>) => void;
export declare function Store<This, Args extends any[]>(t: new (...args: Args) => This, ctx: ClassDecoratorContext<new (...args: Args) => This>): void;
export declare function Store<This, Args extends any[]>(t: new (...args: Args) => This): void | (new (...args: Args) => This);
export {};
