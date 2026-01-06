import { DecoratorCallbackType } from "../model";
import { ExcludeMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

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
export function exclude<This, T>(fn: DecoratorCallbackType<T, This> | boolean) {
  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new ExcludeMetadata({ callback: fn, name: String(name) });
    const fields = getOwnMetadata(instance.metadataKey, target, new Array<ExcludeMetadata>());
    defineMetadata(instance.metadataKey, [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    c.addInitializer(function (this: This) {
      const instance = new ExcludeMetadata({ callback: fn, name: String(c.name) });
      const fields = getOwnMetadata(instance.metadataKey, this, new Array<ExcludeMetadata>());
      defineMetadata(instance.metadataKey, [...fields, instance], this);
    });
  };

  function callback(t: any, c: ClassFieldDecoratorContext<This, T>) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c);
      if (c.kind === "field") return;
      return c;
    }
  }

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;
}