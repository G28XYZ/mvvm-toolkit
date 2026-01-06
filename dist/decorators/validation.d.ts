import { DecoratorCallbackType } from "../model";
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
export declare function validation<This, T>(fn: DecoratorCallbackType<T, This>): AnyFieldDecorator<This, T>;
