import lodash from "lodash";
import { defineMetadata, getOwnMetadata, TInstance } from "../utils";
import { createLegacyClassContext, isDecoratorContext, isLegacyPropertyDecoratorArgs } from "../utils/decorators";

const SERVICE_METADATA_KEY = Symbol("service-key");
const _SERVICES: Record<string, ServiceType> = new Proxy({}, Reflect);

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
export function Inject<This, T>(serviceName: string | T): (...args: any[]) => any;
export function Inject<This, K extends keyof DiServices>(
  serviceName: K
): (t: undefined, c: ClassFieldDecoratorContext<This, InjectType<K>>) => void;
export function Inject<This, K extends keyof DiServices>(
  serviceName: K
): (t: ClassAccessorDecoratorTarget<This, InjectType<K>>, c: ClassAccessorDecoratorContext<This, InjectType<K>>) => ClassAccessorDecoratorTarget<This, InjectType<K>> | void;
export function Inject<This, K extends keyof DiServices>(
  serviceName: K
): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, InjectType<K>> | string | symbol) => any;
export function Inject<This, T>(serviceName: string): (t: undefined, c: ClassFieldDecoratorContext<This, T>) => void;
export function Inject<This, T>(
  serviceName: string
): (t: ClassAccessorDecoratorTarget<This, T>, c: ClassAccessorDecoratorContext<This, T>) => ClassAccessorDecoratorTarget<This, T> | void;
export function Inject<This, T>(serviceName: string): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol) => any;
/**
 *
 * @param serviceName
 */
export function Inject<This, T>(serviceName: T): (t: undefined, c: ClassFieldDecoratorContext<This, any>) => void;
export function Inject<This, T>(
  serviceName: T
): (t: ClassAccessorDecoratorTarget<This, any>, c: ClassAccessorDecoratorContext<This, any>) => ClassAccessorDecoratorTarget<This, any> | void;
export function Inject<This, T>(serviceName: T): (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, any> | string | symbol) => any;
/**
 *
 * @param serviceName
 * @returns
 */
/**
 * Реализация Inject.
 */
export function Inject<This, T>(serviceName: string | T) {
  const defineLegacy = (target: object, name: string | symbol) => {
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: true,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, name)) {
          return Reflect.get(this, name);
        }
        const service = GetService(serviceName as any, "instance");
        if (service) {
          Object.defineProperty(this, name, { value: service, writable: true, configurable: true, enumerable: true });
          return service;
        }
        return undefined;
      },
      set(value: unknown) {
        const service = GetService(serviceName as any, "instance");
        const nextValue = service ?? value;
        Object.defineProperty(this, name, { value: nextValue, writable: true, configurable: true, enumerable: true });
      },
    });
  };

  function callback(t: any, c: ClassFieldDecoratorContext<This, string | T>) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    c.addInitializer(async function (this) {
      const service = GetService(serviceName, "instance");
      if (service && Object.hasOwn(this as object, c.name)) {
        Reflect.set(this as object, c.name, service);
      }
    });
    return (value: any) => value;
  }

  return callback as any;
}
/**
 * Получить сервис или его свойство по ключу контейнера.
 */
export function GetService<
  K extends keyof DiServices,
  P extends keyof ServiceType<DiServices[K]> = keyof ServiceType<DiServices[K]>
>(serviceName: K, serviceProp: P): ServiceType<DiServices[K]>[P];
/**
 * Получить сервис или его свойство по классу.
 */
export function GetService<
  T extends DiServices[keyof DiServices],
  P extends keyof ServiceType<T> = keyof ServiceType<T>
>(serviceName: T, serviceProp: P): ServiceType<T>[P];
/**
 * Получить свойство сервиса по строковому имени (без типизации).
 */
export function GetService<T = any>(
  serviceName: string,
  serviceProp: keyof ServiceType<T>
): T;
/**
 * Получить свойство сервиса по строковому имени (без типизации).
 */
export function GetService<K extends keyof ServiceType<any>>(
  serviceName: string,
  serviceProp: K
): ServiceType<any>[K];
/**
 * Получить сервис или его свойство по generic типу.
 */
export function GetService<T, A extends any[] = any[], K extends keyof ServiceType<T, A> = keyof ServiceType<T, A>>(
  serviceName: T,
  serviceProp: K
): ServiceType<T, A>[K];
/**
 * Получить свойство сервиса по классу.
 */
export function GetService<T, A extends any[] = any[], K extends keyof ServiceType<T, A> = keyof ServiceType<T, A>>(
  serviceName: TInstance<T, A>,
  serviceProp: K
): ServiceType<T, A>[K];
/**
 * Получить сервис по ключу контейнера.
 */
export function GetService<K extends keyof DiServices>(serviceName: K): ServiceType<DiServices[K]>;
/**
 * Получить сервис по классу из контейнера.
 */
export function GetService<T extends DiServices[keyof DiServices]>(serviceName: T): ServiceType<T>;
/**
 * Получить сервис по строковому имени (без типизации).
 */
export function GetService(serviceName: string): ServiceType<unknown>;
/**
 * Получить сервис по классу.
 */
export function GetService<T, A extends any[] = any[]>(serviceName: TInstance<T, A>): ServiceType<T, A>;
/**
 * Реализация GetService.
 */
export function GetService<T, A extends any[] = any[], K extends keyof ServiceType<T, A> = keyof ServiceType<T, A>>(
  serviceName: string | T,
  serviceProp?: K
) {
  const services = getOwnMetadata(SERVICE_METADATA_KEY, _SERVICES);

  if (typeof serviceName !== "string") {
    const service: ServiceType<T, A> = getOwnMetadata(SERVICE_METADATA_KEY, serviceName);
    if (service) {
      return serviceProp && serviceProp in service ? service[serviceProp] : service;
    }

    for (const name in services) {
      const item = services[name];
      if (item.target === serviceName) {
        serviceName = item.context.name;
        break;
      }
    }
  }

  if (typeof serviceName === "string") {
    if (serviceProp) return services[serviceName]?.[serviceProp];

    return services[serviceName];
  }
}

/**
 * Декоратор регистрации сервиса.
 */
export function Service<This, Args extends any[]>(
  options: string | IServiceOptions
): (t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => void;
/**
 * Декоратор регистрации сервиса (без параметров).
 */
export function Service<This, Args extends any[]>(t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>): void;
/**
 * Legacy вызов декоратора регистрации сервиса.
 */
export function Service<This, Args extends any[]>(t: TInstance<This, Args>): void | TInstance<This, Args>;
/**
 * Реализация Service.
 */
export function Service<This, Args extends any[]>(
  options?:
    | string
    | IServiceOptions // TODO - options
    | TInstance<This, Args>,
  ctx?: ClassDecoratorContext<TInstance<This, Args>>
) {
  const define = (t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>) => {
    const serviceName = String(
      (typeof options === "string" && options) || (typeof options === "object" && options?.id) || ctx?.name || t?.name
    );

    const services = getOwnMetadata<Record<string, ServiceType<This, Args>>>(SERVICE_METADATA_KEY, _SERVICES);

    const proxy = new Proxy(
      {
        target: t,
        instance:
          typeof options === "object" && Reflect.get(options, "transient")
            ? t
            : typeof options === "object" && Reflect.get(options, "lazy")
              ? t
              : new t(...([] as unknown as Args)),
        context: ctx,
        options,
      } as ServiceType<This, Args>,
      {
        get(target, p, receiver) {
          if (p === "instance" && target?.options?.transient) return new t(...([] as unknown as Args));
          if (p === "instance" && target?.options?.lazy && target.instance === t) {
            const instance = new t(...([] as unknown as Args));
            Reflect.set(target, p, instance, receiver);
            return instance;
          }
          return Reflect.get(target, p, receiver);
        },
        set(target, p, newValue, receiver) {
          return Reflect.set(target, p, newValue, receiver);
        },
      }
    );

    services[serviceName] = proxy;

    defineMetadata(SERVICE_METADATA_KEY, services, _SERVICES);
    defineMetadata<any>(SERVICE_METADATA_KEY, services[serviceName], t);
  };

  function callback(t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>): void | TInstance<This, Args> {
    const legacySource = (t as unknown as { __mvvm_legacy_source__?: TInstance<This, Args> }).__mvvm_legacy_source__;
    const context = isDecoratorContext(ctx)
      ? ctx
      : createLegacyClassContext(legacySource?.name ?? t?.name ?? "");
    define(t, context);
    if (legacySource && legacySource !== t) {
      defineMetadata<any>(SERVICE_METADATA_KEY, getOwnMetadata(SERVICE_METADATA_KEY, t), legacySource);
    }
  }

  if (lodash.isFunction(options)) {
    return callback(options as TInstance<This, Args>, ctx);
  }

  if (options) return (t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => callback(t, ctx);

  return callback;
}

/**
 * Ручная регистрация сервиса без декоратора.
 */
export const SetService = <T>(instance: TInstance<T, any[]>, options?: IServiceOptions & { ctx: Partial<ClassDecoratorContext<TInstance<T, any[]>>> }) => {

  const { kind = 'class', name = '', addInitializer = () => void 0, metadata } = options?.ctx || {}

  Service(options)(instance, {
    kind,
    name,
    addInitializer,
    metadata
  });

  return GetService(instance).instance;
};

export type ServiceEntry = TInstance<any, any[]> | (() => TInstance<any, any[]>);
export type ServiceMap = Record<string, ServiceEntry>;
export interface DiServices {}
export type InjectType<K extends keyof DiServices = keyof DiServices> = InstanceType<DiServices[K]>;
