import { Model } from "../model";
import { defineMetadata, getOwnMetadata, TInstance } from "../utils";
import { isDecoratorContext, isLegacyPropertyDecoratorArgs } from "../utils/decorators";
import { ExcludeMetadata, FieldMetadata, IFieldMetadata, PropFromViewMetadata, SubmitMetadata, ValidationMetadata } from "../model/data";
import { DecoratorCallbackType, ModelData } from "../model/types";
import { makeObservable } from "mobx";

type AnyFieldDecorator<This, T> = (
  targetOrValue: object | undefined,
  contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol
) => any;

const isDevtoolsHistoryEnabled = () => {
  const globalAny = globalThis as unknown as {
    __MVVM_DEVTOOLS_AUTO__?: boolean;
    __MVVM_DEVTOOLS_HISTORY__?: boolean;
  };
  return Boolean(globalAny.__MVVM_DEVTOOLS_HISTORY__ ?? globalAny.__MVVM_DEVTOOLS_AUTO__);
};

const resolveFieldOptions = <TOptions extends object | undefined>(options: TOptions): TOptions | { collectChanges: boolean } => {
  if (!isDevtoolsHistoryEnabled()) return options;
  if (!options || typeof options !== "object") return { collectChanges: true };
  if ("collectChanges" in options) return options;
  return { ...options, collectChanges: true };
};

/**
 * Декоратор свойства класса для поля модели {@link field}.
 * Валидирует значение поля при изменении и пишет результат в {@link Model.validation}.
 * @param fn функция валидации (value, instance) => string|boolean
 * @example
 * class VM extends Model<{ age: number }> {
 *   @field
 *   @validation((value) => (value < 0 ? "age < 0" : ""))
 *   age = 0;
 * }
 */
export function validation<This, T>(fn: DecoratorCallbackType<T, This>): AnyFieldDecorator<This, T>;
export function validation<This, T>(fn: DecoratorCallbackType<T, This>): any {
  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new ValidationMetadata({ callback: fn, name: String(name) });
    const fields = getOwnMetadata(instance["metadataKey"], target, new Array<ValidationMetadata>());
    defineMetadata(instance["metadataKey"], [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const instance = new ValidationMetadata({ callback: fn, name: String(c.name) });
      const fields = getOwnMetadata(instance["metadataKey"], this, new Array<ValidationMetadata>());
      defineMetadata(instance["metadataKey"], [...fields, instance], this);
    });
  };

  function callback(t: any, c: any) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c as ClassFieldDecoratorContext<This, T>);
      if ((c as ClassFieldDecoratorContext<This, T>).kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;

  return ((value: T) => value) as any;
}
/**
 * Декоратор для преобразования поля при сериализации через {@link Model.dumpData}.
 * @param fn функция трансформации (value, instance) => any
 * @example
 * class VM extends Model<{ name: string }> {
 *   @field
 *   @submit((value) => value?.trim())
 *   name = "";
 * }
 */
export function submit<This, T>(fn: DecoratorCallbackType<T, This>): AnyFieldDecorator<This, T>;
export function submit<This, T>(fn: DecoratorCallbackType<T, This>): any {
  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new SubmitMetadata({ callback: fn, name: String(name) });
    const fields = getOwnMetadata(instance["metadataKey"], target, new Array<SubmitMetadata>());
    defineMetadata(instance["metadataKey"], [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const instance = new SubmitMetadata({ callback: fn, name: String(c.name) });
      const fields = getOwnMetadata(instance["metadataKey"], this, new Array<SubmitMetadata>());
      defineMetadata(instance["metadataKey"], [...fields, instance], this);
    });
  };

  function callback(t: any, c: any) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c as ClassFieldDecoratorContext<This, T>);
      if ((c as ClassFieldDecoratorContext<This, T>).kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;

  return ((value: T) => value) as any;
}
/**
 * Декоратор исключения поля из {@link Model.dumpData}.
 * @param fn функция или boolean. true — исключить поле.
 * @example
 * class VM extends Model<{ token: string }> {
 *   @field
 *   @exclude(true)
 *   token = "";
 * }
 */
export function exclude<This, T>(
  fn: DecoratorCallbackType<T, This> | boolean
): AnyFieldDecorator<This, T>;
export function exclude<This, T>(fn: DecoratorCallbackType<T, This> | boolean): any {
  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new ExcludeMetadata({ callback: fn, name: String(name) });
    const fields = getOwnMetadata(instance["metadataKey"], target, new Array<ExcludeMetadata>());
    defineMetadata(instance["metadataKey"], [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const instance = new ExcludeMetadata({ callback: fn, name: String(c.name) });
      const fields = getOwnMetadata(instance["metadataKey"], this, new Array<ExcludeMetadata>());
      defineMetadata(instance["metadataKey"], [...fields, instance], this);
    });
  };

  function callback(t: any, c: any) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c as ClassFieldDecoratorContext<This, T>);
      if ((c as ClassFieldDecoratorContext<This, T>).kind === "field") return;
      return c;
    }
  }

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;
}

/**
 * Декоратор для поля модели.
 * Обозначает свойство как поле модели и включает обработку для dump/validation.
 * @example
 * class VM extends Model<{ title: string }> {
 *   @field
 *   title = "";
 * }
 */

/**
 * Декоратор для поля класса (автоматом вешает observable на поле)
 * обозначает свойство как поле модели, которое обрабатывается/валидируется/исключается при изменении/отправке
 */
export function field<This, T>(
  targetOrValue: object | undefined,
  contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol
): any;

/**
 * Декоратор поля модели с опциями.
 * @param options опции поля (factory/mapping/collectChanges).
 * @example
 * class VM extends Model<{ count: number }> {
 *   @field({ collectChanges: true })
 *   count = 0;
 * }
 */
export function field<This, T = unknown>(
  options: Pick<IFieldMetadata<ModelData<This>, This>, "factory" | "mapping" | "collectChanges">
): AnyFieldDecorator<This, T>;
export function field<This, T>(
  options: undefined | Pick<IFieldMetadata<This, T>, "factory" | "mapping" | "collectChanges"> | object,
  c?: ClassFieldDecoratorContext<This, T> | string | symbol
): any {
  const resolvedOptions = resolveFieldOptions(isLegacyPropertyDecoratorArgs(options, c) ? undefined : options);

  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new FieldMetadata({ ...resolvedOptions, name: String(name), ctx: null });
    const fields = getOwnMetadata(instance["metadataKey"], target, new Array<FieldMetadata>());
    defineMetadata(instance["metadataKey"], [...fields, instance], target);

    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (!descriptor) {
      Object.defineProperty(target, name, {
        configurable: true,
        enumerable: true,
        get(this: Model<T>) {
          const self = this;
          if (Object.prototype.hasOwnProperty.call(self, name)) {
            return Reflect.get(self, name);
          }
          const initField = (self as unknown as { initField?: (field: string, options?: { skipValidation?: boolean }) => void }).initField;
          const initData = (self as unknown as { initData?: Record<string | symbol, unknown> }).initData;
          if (initData && name in initData && typeof initField === "function") {
            initField.call(self, String(name), { skipValidation: true });
            return Reflect.get(self, name);
          }
          return undefined;
        },
        set(this: Model<T>, value: T) {
          const self = this;
          const initField = (self as unknown as { initField?: (field: string, options?: { skipValidation?: boolean }) => void }).initField;
          const initData = (self as unknown as { initData?: Record<string | symbol, unknown> }).initData;
          if (initData && !(name in initData)) {
            Reflect.set(initData, name, value);
          }
          if (typeof initField === "function") {
            initField.call(self, String(name), { skipValidation: true });
            return;
          }
          Object.defineProperty(this, name, { value, writable: true, configurable: true, enumerable: true });
        },
      });
    }
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const instanceTarget = this as { initField?: (field: string, options?: { skipValidation?: boolean }) => void };
      if (typeof instanceTarget.initField === "function") {
        const instance = new FieldMetadata({ ...resolvedOptions, name: String(c.name), ctx: c });
        const fields = getOwnMetadata(instance["metadataKey"], this, new Array<FieldMetadata>());
        defineMetadata(instance["metadataKey"], [...fields, instance], this);
        instanceTarget.initField.call(this, String(c.name));
      }
    });
  };

  function callback(t: any, c: any) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c as ClassFieldDecoratorContext<This, T>);
      if ((c as ClassFieldDecoratorContext<This, T>).kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (isLegacyPropertyDecoratorArgs(options, c)) {
    return callback(options as any, c as any);
  }

  if (resolvedOptions && !isDecoratorContext(c)) return (t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c);

  if (isDecoratorContext(c)) return callback(undefined, c);

  return (t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c);
}
/**
 * Декоратор свойства класса для прокидывания пропсов из view в view model.
 * @example
 * class VM {
 *   @PropFromView("title")
 *   title = "";
 * }
 * // JSX: <Component title="Hello" />
 */
export function PropFromView<This, T>(
  propName: string
): AnyFieldDecorator<This, T>;
export function PropFromView<This, T>(propName: string): any {
  const defineLegacy = (target: object, name: string | symbol) => {
    const metadata = new PropFromViewMetadata({ name: propName, originName: String(name) });
    metadata.name = propName;
    metadata.originName = String(name);
    const propsFromView = getOwnMetadata(metadata["metadataKey"], target, new Array<PropFromViewMetadata>());
    defineMetadata(metadata["metadataKey"], [...propsFromView, metadata], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const metadata = new PropFromViewMetadata();
      const propsFromView = metadata.fields(this);
      for (const prop in this) {
        if (propsFromView instanceof Array && c.name === prop) {
          metadata.name = propName;
          metadata.originName = prop;
          metadata.value = this[prop];
          propsFromView.push(metadata);
        }
      }
      defineMetadata(metadata["metadataKey"], propsFromView, this as object);
    });
  };

  function callback(t: undefined, c: ClassFieldDecoratorContext<This, T> | string | symbol) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c as ClassFieldDecoratorContext<This, T>);
      if ((c as ClassFieldDecoratorContext<This, T>).kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (propName) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;

  return ((value: T) => value) as any;
}

/**
 * Декоратор для автоматического вызова makeObservable в конструкторе.
 * @example
 * @MakeObservable
 * class VM {
 *   @observable accessor count = 0;
 * }
 */
export function MakeObservable<This extends object, Args extends any[]>(): (
  t: TInstance<This, Args>,
  ctx?: ClassDecoratorContext<TInstance<This, Args>>
) => TInstance<This, Args> | void;
/**
 *
 * @param t
 * @param ctx
 */
export function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>): void;
export function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>): TInstance<This, Args> | void;
/**
 *
 * @param t
 * @param ctx
 * @returns
 */
export function MakeObservable<This extends object, Args extends any[]>(
  t?: TInstance<This, Args>,
  ctx?: ClassDecoratorContext<TInstance<This, Args>>
): TInstance<This, Args> | void | ((t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => TInstance<This, Args> | void) {
  const decorateLegacy = <T extends new (...args: any[]) => object>(target: T) =>
    class extends target {
      constructor(...args: any[]) {
        super(...args);
        makeObservable(this);
      }
    };
  const copyLegacyMetadata = <T extends new (...args: any[]) => object>(source: T, next: T) => {
    if (typeof Reflect?.getOwnMetadataKeys !== "function") return;
    for (const key of Reflect.getOwnMetadataKeys(source)) {
      const value = Reflect.getOwnMetadata(key, source);
      Reflect.defineMetadata(key, value, next);
    }
  };

  function callback(target: TInstance<This, Args>, context?: ClassDecoratorContext<TInstance<This, Args>>) {
    if (!isDecoratorContext(context)) {
      const source = target as new (...args: any[]) => object;
      const next = decorateLegacy(source) as TInstance<This, Args>;
      Object.defineProperty(next, "__mvvm_legacy_source__", { value: source, configurable: true });
      copyLegacyMetadata(source, next as new (...args: any[]) => object);
      return next;
    }
    context.addInitializer(function (this) {
      makeObservable(this);
    });
  }

  if (t && !isDecoratorContext(ctx)) return callback(t, ctx);

  if (t) return callback(t, ctx);

  return callback;
}

export { define_prop } from "./define_prop";
