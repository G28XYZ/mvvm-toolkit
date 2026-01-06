/** Общий тип контекста для field/accessor декораторов. */
export type DefinePropContext<This, T> = ClassFieldDecoratorContext<This, T> | ClassAccessorDecoratorContext<This, T>;
/**
 * Декоратор для определения свойства с не перечисляемым дескриптором по умолчанию.
 * @example
 * class VM {
 *   @define_prop
 *   internalId = 1;
 * }
 */
export declare function define_prop(value: any, context: any): any;
/**
 * Декоратор для определения свойства с пользовательскими опциями дескриптора.
 * @example
 * class VM {
 *   @define_prop({ enumerable: true })
 *   publicId = 1;
 * }
 */
export declare function define_prop(options?: PropertyDescriptor): any;
