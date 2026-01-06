import { DecoratorCallbackType, Model } from "../model";
import { ValidationMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

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
    const fields = getOwnMetadata(instance.metadataKey, target, new Array<ValidationMetadata>());
    defineMetadata(instance.metadataKey, [...fields, instance], target);
  };

  const define = (c: ClassFieldDecoratorContext<Model<T>, T>) => {
    const instance = new ValidationMetadata({ callback: fn, name: String(c.name) });
    c.addInitializer(function (this: This) {
      const fields = getOwnMetadata(instance.metadataKey, this, new Array<ValidationMetadata>());
      defineMetadata(instance.metadataKey, [...fields, instance], this);
    } as any);
  };

  function callback(t: any, c: ClassFieldDecoratorContext<This | Model<T>, T> | string | symbol) {
    if (isLegacyPropertyDecoratorArgs(t, c)) {
      defineLegacy(t, c);
      return;
    }
    if (isDecoratorContext(c)) {
      define(c);
      if ((c).kind === "field") return (value: T) => value;
      return c;
    }
  }

  if (fn) return ((t: undefined, c: ClassFieldDecoratorContext<This, T>) => callback(t, c)) as any;

  return ((value: T) => value) as any;
}