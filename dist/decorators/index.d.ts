import { TInstance } from "../utils";
import { IFieldMetadata } from "../model/data";
import { DecoratorCallbackType, ModelData } from "../model/types";
type AnyFieldDecorator<This, T> = (targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol) => any;
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
/**
 * Декоратор для поля модели.
 * Обозначает свойство как поле модели и включает обработку для dump/validation.
 * @example
 * class VM extends Model<{ title: string }> {
 *   @field
 *   title = "";
 * }
 */
/**
 * Декоратор для поля класса (автоматом вешает observable на поле)
 * обозначает свойство как поле модели, которое обрабатывается/валидируется/исключается при изменении/отправке
 */
export declare function field<This, T>(targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol): any;
/**
 * Декоратор поля модели с опциями.
 * @param options опции поля (factory/mapping/collectChanges).
 * @example
 * class VM extends Model<{ count: number }> {
 *   @field({ collectChanges: true })
 *   count = 0;
 * }
 */
export declare function field<This, T = unknown>(options: Pick<IFieldMetadata<ModelData<This>, This>, "factory" | "mapping" | "collectChanges">): AnyFieldDecorator<This, T>;
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
/**
 * Декоратор для автоматического вызова makeObservable в конструкторе.
 * @example
 * @MakeObservable
 * class VM {
 *   @observable accessor count = 0;
 * }
 */
export declare function MakeObservable<This extends object, Args extends any[]>(): (t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => TInstance<This, Args> | void;
/**
 *
 * @param t
 * @param ctx
 */
export declare function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>): void;
export declare function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>): TInstance<This, Args> | void;
export { define_prop } from "./define_prop";
