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
type FieldOptions<This> = Pick<IFieldMetadata<ModelData<This>, This>, "factory" | "mapping" | "collectChanges" | "noObserve">;
type FieldDecorator = {
    <This, T>(targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol): any;
    <This, T = unknown>(options: FieldOptions<This>): AnyFieldDecorator<This, T>;
    noObserve: {
        <This, T>(targetOrValue: object | undefined, contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol): any;
        <This, T = unknown>(options?: FieldOptions<This>): AnyFieldDecorator<This, T>;
    };
};
/**
 * Декоратор для поля класса (автоматом вешает observable на поле)
 * обозначает свойство как поле модели, которое обрабатывается/валидируется/исключается при изменении/отправке
 */
export declare const field: FieldDecorator;
export {};
