/**
 * Декоратор для поля модели.
 * Обозначает свойство как поле модели и включает обработку для dump/validation.
 * @example
 * class VM extends TModel<{ title: string }> {
 *   @field
 *   title = "";
 * }
 */

import { ModelData, Model } from "../model";
import { IFieldMetadata, FieldMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

const isDevtoolsHistoryEnabled = () => {
  const globalAny = globalThis as unknown as {
    __MVVM_DEVTOOLS_AUTO__?: boolean;
    __MVVM_DEVTOOLS_HISTORY__?: boolean;
  };
  return Boolean(globalAny.__MVVM_DEVTOOLS_HISTORY__ ?? globalAny.__MVVM_DEVTOOLS_AUTO__);
};

const resolveFieldOptions = <TOptions extends object | undefined>(
  options: TOptions
): TOptions | { collectChanges: boolean } => {
  if (!isDevtoolsHistoryEnabled()) return options;
  if (!options || typeof options !== "object") return { collectChanges: true };
  if ("collectChanges" in options) return options;
  return { ...options, collectChanges: true };
};

const protoFieldRegistry = new WeakMap<object, Set<string>>();

const registerFieldMetadata = (proto: object, instance: FieldMetadata) => {
  if (!proto) return;
  let registry = protoFieldRegistry.get(proto);
  if (!registry) {
    registry = new Set<string>();
    protoFieldRegistry.set(proto, registry);
  }
  const name = String(instance.name);
  if (registry.has(name)) return;
  const list = getOwnMetadata(instance.metadataKey, proto, new Array<FieldMetadata>());
  if (!list.some((item) => item.name === name)) {
    defineMetadata(instance.metadataKey, [...list, instance], proto);
  }
  registry.add(name);
};

type FieldOptions<This> = Pick<
  IFieldMetadata<ModelData<This>, This>,
  "factory" | "mapping" | "collectChanges" | "noObserve"
>;

type FieldDecorator = {
  // Декоратор без опций: @field prop;
  <This, T>(
    targetOrValue: object | undefined,
    contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol
  ): any;
  
  // Фабрика декоратора с опциями: @field({ ... }) prop;
  <This, T = unknown>(options: FieldOptions<This>): AnyFieldDecorator<This, T>;
  
  // Свойство noObserve
  noObserve: {
    // @field.noObserve prop;
    <This, T>(
      targetOrValue: object | undefined,
      contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol
    ): any;
    
    // @field.noObserve() / @field.noObserve({ ... })
    <This, T = unknown>(options?: FieldOptions<This>): AnyFieldDecorator<This, T>;
  };
};

/**
 * Декоратор для поля класса (автоматом вешает observable на поле)
 * обозначает свойство как поле модели, которое обрабатывается/валидируется/исключается при изменении/отправке
 */
export const field: FieldDecorator = function field<This, T>(
  optionsOrTarget?: object,
  contextOrKey?: ClassFieldDecoratorContext<This, T> | string | symbol
) {
  const resolvedOptions = resolveFieldOptions(
    isLegacyPropertyDecoratorArgs(optionsOrTarget, contextOrKey) ? undefined : optionsOrTarget
  );

  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new FieldMetadata({ ...resolvedOptions, name: String(name), ctx: null });
    defineMetadata(
      instance.metadataKey,
      [...getOwnMetadata(instance.metadataKey, target, new Array<FieldMetadata>()), instance],
      target
    );

    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (!descriptor) {
      Object.defineProperty(target, name, {
        configurable: true,
        enumerable: true,
        get(this: Model<T>) {
          if (Object.prototype.hasOwnProperty.call(this, name)) return Reflect.get(this, name);
          if (this.initData && name in this.initData && typeof this.initField === "function") {
            this.initField.call(this, String(name), { skipValidation: true });
            return Reflect.get(this, name);
          }
          return undefined;
        },
        set(this: Model<T>, value: T) {
          if (this.initData && !(name in this.initData)) Reflect.set(this.initData, name, value);
          if (typeof this.initField === "function") {
            this.initField.call(this, String(name), { skipValidation: true });
            return;
          }
          Object.defineProperty(this, name, {
            value,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        },
      });
    }
  };

  const define = (ctx: ClassFieldDecoratorContext<Model<T>, T>) => {
    ctx.addInitializer(function (this: Model<T>) {
      if (this instanceof Model && typeof this.initField === "function") {
        const instance = new FieldMetadata({
          ...resolvedOptions,
          name: String(ctx.name),
          ctx,
        });
        registerFieldMetadata(Object.getPrototypeOf(this), instance);
        this.initField.call(this, String(ctx.name));
      }
    });
  };

  function callback(
    t: object,
    ctxOrKey: ClassFieldDecoratorContext<This | Model<T>, T> | string | symbol
  ) {
    if (isLegacyPropertyDecoratorArgs(t, ctxOrKey)) {
      defineLegacy(t, ctxOrKey);
      return;
    }
    if (isDecoratorContext(ctxOrKey)) {
      define(ctxOrKey);
      if (ctxOrKey.kind === "field") return (value: T) => value;
      return ctxOrKey;
    }
  }

  if (isLegacyPropertyDecoratorArgs(optionsOrTarget, contextOrKey)) {
    return callback(optionsOrTarget, contextOrKey);
  }

  if (resolvedOptions && !isDecoratorContext(contextOrKey)) {
    return (t: undefined, ctx: ClassFieldDecoratorContext<This, T>) => callback(t, ctx);
  }

  if (isDecoratorContext(contextOrKey)) return callback(undefined, contextOrKey);

  return (t: undefined, ctx: ClassFieldDecoratorContext<This, T>) => callback(t, ctx);
} as FieldDecorator;

const forceNoObserve = <TOptions extends object | undefined>(options: TOptions) => {
  if (!options || typeof options !== "object") return { noObserve: true };
  return { ...options, noObserve: true };
};

const noObserveImplementation = function noObserve<This, T>(
  optionsOrTarget?: object,
  contextOrKey?: string | symbol | ClassFieldDecoratorContext<unknown, unknown>
) {
  if (isLegacyPropertyDecoratorArgs(optionsOrTarget, contextOrKey) || isDecoratorContext(contextOrKey)) {
    return field({ noObserve: true })(optionsOrTarget, contextOrKey);
  }
  return field(forceNoObserve(optionsOrTarget));
};

field.noObserve = noObserveImplementation;
