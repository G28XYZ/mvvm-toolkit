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

const resolveFieldOptions = <TOptions extends object | undefined>(options: TOptions): TOptions | { collectChanges: boolean } => {
  if (!isDevtoolsHistoryEnabled()) return options;
  if (!options || typeof options !== "object") return { collectChanges: true };
  if ("collectChanges" in options) return options;
  return { ...options, collectChanges: true };
};

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
) {
  const resolvedOptions = resolveFieldOptions(isLegacyPropertyDecoratorArgs(options, c) ? undefined : options);

  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new FieldMetadata({ ...resolvedOptions, name: String(name), ctx: null });
    const fields = getOwnMetadata(instance.metadataKey, target, new Array<FieldMetadata>());
    defineMetadata(instance.metadataKey, [...fields, instance], target);

    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (!descriptor) {
      Object.defineProperty(target, name, {
        configurable: true,
        enumerable: true,
        get(this: Model<T>) {
          if (Object.prototype.hasOwnProperty.call(this, name)) {
            return Reflect.get(this, name);
          }
          if (this.initData && name in this.initData && typeof this.initField === "function") {
            this.initField.call(this, String(name), { skipValidation: true });
            return Reflect.get(this, name);
          }
          return undefined;
        },
        set(this: Model<T>, value: T) {
          if (this.initData && !(name in this.initData)) {
            Reflect.set(this.initData, name, value);
          }
          if (typeof this.initField === "function") {
            this.initField.call(this, String(name), { skipValidation: true });
            return;
          }
          Object.defineProperty(this, name, { value, writable: true, configurable: true, enumerable: true });
        },
      });
    }
  };

  const define = (c: ClassFieldDecoratorContext<Model<T>, T>) => {
    c.addInitializer(function (this: Model<T>) {
      if (this instanceof Model && typeof this.initField === "function") {
        const instance = new FieldMetadata({ ...resolvedOptions, name: String(c.name), ctx: c });
        const fields = getOwnMetadata(instance.metadataKey, this, new Array<FieldMetadata>());
        defineMetadata(instance.metadataKey, [...fields, instance], this);
        this.initField.call(this, String(c.name));
      }
    });
  };

  function callback(t: any, c: ClassFieldDecoratorContext<This | Model<T>, T> | string | symbol) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c);
      if (c.kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (isLegacyPropertyDecoratorArgs(options, c)) {
    return callback(options, c);
  }

  if (resolvedOptions && !isDecoratorContext(c)) return (t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c);

  if (isDecoratorContext(c)) return callback(undefined, c);

  return (t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c);
}