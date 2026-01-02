import { TInstance } from "../utils";
export interface IServiceOptions {
    id: string;
    transient?: boolean;
    lazy?: boolean;
}
export type ServiceType<This = any, Args extends any[] = any[]> = {
    target?: TInstance<This, Args>;
    instance?: This extends TInstance ? InstanceType<This> : This;
    context?: ClassDecoratorContext<TInstance<This, Args>>;
    options?: IServiceOptions;
};
/**
 * Декоратор для инъекции сервиса по строковому имени.
 */
export declare function Inject<This, T>(serviceName: string | T): (...args: any[]) => any;
export declare function Inject<This, K extends keyof DiServices>(serviceName: K): (t: undefined, c: ClassFieldDecoratorContext<This, InjectType<K>>) => void;
export declare function Inject<This, K extends keyof DiServices>(serviceName: K): (t: ClassAccessorDecoratorTarget<This, InjectType<K>>, c: ClassAccessorDecoratorContext<This, InjectType<K>>) => ClassAccessorDecoratorTarget<This, InjectType<K>> | void;
export declare function Inject<This, K extends keyof DiServices>(serviceName: K): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, InjectType<K>> | string | symbol) => any;
export declare function Inject<This, T>(serviceName: string): (t: undefined, c: ClassFieldDecoratorContext<This, T>) => void;
export declare function Inject<This, T>(serviceName: string): (t: ClassAccessorDecoratorTarget<This, T>, c: ClassAccessorDecoratorContext<This, T>) => ClassAccessorDecoratorTarget<This, T> | void;
export declare function Inject<This, T>(serviceName: string): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol) => any;
/**
 *
 * @param serviceName
 */
export declare function Inject<This, T>(serviceName: T): (t: undefined, c: ClassFieldDecoratorContext<This, any>) => void;
export declare function Inject<This, T>(serviceName: T): (t: ClassAccessorDecoratorTarget<This, any>, c: ClassAccessorDecoratorContext<This, any>) => ClassAccessorDecoratorTarget<This, any> | void;
export declare function Inject<This, T>(serviceName: T): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, any> | string | symbol) => any;
/**
 * Получить сервис или его свойство по ключу контейнера.
 */
export declare function GetService<K extends keyof DiServices, P extends keyof ServiceType<DiServices[K]> = keyof ServiceType<DiServices[K]>>(serviceName: K, serviceProp: P): ServiceType<DiServices[K]>[P];
/**
 * Получить сервис или его свойство по классу.
 */
export declare function GetService<T extends DiServices[keyof DiServices], P extends keyof ServiceType<T> = keyof ServiceType<T>>(serviceName: T, serviceProp: P): ServiceType<T>[P];
/**
 * Получить свойство сервиса по строковому имени (без типизации).
 */
export declare function GetService<T = any>(serviceName: string, serviceProp: keyof ServiceType<T>): T;
/**
 * Получить свойство сервиса по строковому имени (без типизации).
 */
export declare function GetService<K extends keyof ServiceType<any>>(serviceName: string, serviceProp: K): ServiceType<any>[K];
/**
 * Получить сервис или его свойство по generic типу.
 */
export declare function GetService<T, A extends any[] = any[], K extends keyof ServiceType<T, A> = keyof ServiceType<T, A>>(serviceName: T, serviceProp: K): ServiceType<T, A>[K];
/**
 * Получить свойство сервиса по классу.
 */
export declare function GetService<T, A extends any[] = any[], K extends keyof ServiceType<T, A> = keyof ServiceType<T, A>>(serviceName: TInstance<T, A>, serviceProp: K): ServiceType<T, A>[K];
/**
 * Получить сервис по ключу контейнера.
 */
export declare function GetService<K extends keyof DiServices>(serviceName: K): ServiceType<DiServices[K]>;
/**
 * Получить сервис по классу из контейнера.
 */
export declare function GetService<T extends DiServices[keyof DiServices]>(serviceName: T): ServiceType<T>;
/**
 * Получить сервис по строковому имени (без типизации).
 */
export declare function GetService(serviceName: string): ServiceType<unknown>;
/**
 * Получить сервис по классу.
 */
export declare function GetService<T, A extends any[] = any[]>(serviceName: TInstance<T, A>): ServiceType<T, A>;
/**
 * Декоратор регистрации сервиса.
 */
export declare function Service<This, Args extends any[]>(options: string | IServiceOptions): (t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => void;
/**
 * Декоратор регистрации сервиса (без параметров).
 */
export declare function Service<This, Args extends any[]>(t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>): void;
/**
 * Legacy вызов декоратора регистрации сервиса.
 */
export declare function Service<This, Args extends any[]>(t: TInstance<This, Args>): void | TInstance<This, Args>;
/**
 * Ручная регистрация сервиса без декоратора.
 */
export declare const SetService: <T>(instance: TInstance<T, any[]>, options?: IServiceOptions & {
    ctx: Partial<ClassDecoratorContext<TInstance<T, any[]>>>;
}) => T extends TInstance ? InstanceType<T> : T;
export type ServiceEntry = TInstance<any, any[]> | (() => TInstance<any, any[]>);
export type ServiceMap = Record<string, ServiceEntry>;
export interface DiServices {
}
export type InjectType<K extends keyof DiServices = keyof DiServices> = InstanceType<DiServices[K]>;
