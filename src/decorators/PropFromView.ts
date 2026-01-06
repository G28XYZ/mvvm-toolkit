import { PropFromViewMetadata } from "../model/data";
import { getOwnMetadata, defineMetadata } from "../utils";
import { isLegacyPropertyDecoratorArgs, isDecoratorContext } from "../utils/decorators";
import { AnyFieldDecorator } from "./types";

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