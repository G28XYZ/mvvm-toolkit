import { DecoratorCallbackType } from "../model";
import { ExcludeMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

const protoExcludeRegistry = new WeakMap<object, Set<string>>();

const registerExcludeMetadata = (proto: object, instance: ExcludeMetadata) => {
  if (!proto) return;
  let registry = protoExcludeRegistry.get(proto);
  if (!registry) {
    registry = new Set<string>();
    protoExcludeRegistry.set(proto, registry);
  }
  const name = String(instance.name);
  if (registry.has(name)) return;
  const list = getOwnMetadata(instance.metadataKey, proto, new Array<ExcludeMetadata>());
  if (!list.some((item) => item.name === name)) {
    defineMetadata(instance.metadataKey, [...list, instance], proto);
  }
  registry.add(name);
};

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
      registerExcludeMetadata(Object.getPrototypeOf(this as object), instance);
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
