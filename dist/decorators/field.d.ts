/**
 * Декоратор для поля модели.
 * Обозначает свойство как поле модели и включает обработку для dump/validation.
 * @example
 * class VM extends TModel<{ title: string }> {
 *   @field
 *   title = "";
 * }
 */
import { ModelData } from "../model";
import { IFieldMetadata } from "../model/data";
import { AnyFieldDecorator } from "./types";
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
