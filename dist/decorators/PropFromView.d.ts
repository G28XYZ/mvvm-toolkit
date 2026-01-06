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
export declare function PropFromView<This, T>(propName: string): AnyFieldDecorator<This, T>;
