import { DecoratorCallbackType } from "../model";
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
export declare function exclude<This, T>(fn: DecoratorCallbackType<T, This> | boolean): AnyFieldDecorator<This, T>;
