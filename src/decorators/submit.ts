import { DecoratorCallbackType } from "../model";
import { SubmitMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

const protoSubmitRegistry = new WeakMap<object, Set<string>>();

const registerSubmitMetadata = (proto: object, instance: SubmitMetadata) => {
  if (!proto) return;
  let registry = protoSubmitRegistry.get(proto);
  if (!registry) {
    registry = new Set<string>();
    protoSubmitRegistry.set(proto, registry);
  }
  const name = String(instance.name);
  if (registry.has(name)) return;
  const list = getOwnMetadata(instance.metadataKey, proto, new Array<SubmitMetadata>());
  if (!list.some((item) => item.name === name)) {
    defineMetadata(instance.metadataKey, [...list, instance], proto);
  }
  registry.add(name);
};

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
export function submit<This, T>(fn: DecoratorCallbackType<T, This>) {
  const defineLegacy = (target: object, name: string | symbol) => {
    const instance = new SubmitMetadata({ callback: fn, name: String(name) });
    const fields = getOwnMetadata(instance.metadataKey, target, new Array<SubmitMetadata>());
    defineMetadata(instance.metadataKey, [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<This, T>) => {
    const instance = new SubmitMetadata({ callback: fn, name: String(c.name) });
    c.addInitializer(function (this: This) {
      registerSubmitMetadata(Object.getPrototypeOf(this as object), instance);
    });
  };

  function callback(t: any, c: ClassFieldDecoratorContext<This, T>) {
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

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;

  return ((value: T) => value) as any;
}
