import { DecoratorCallbackType } from "../model";
import { AnyFieldDecorator } from "./types";
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
export declare function submit<This, T>(fn: DecoratorCallbackType<T, This>): AnyFieldDecorator<This, T>;
