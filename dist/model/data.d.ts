import { IMetadataModel } from "./types";
/**
 * Базовая модель метаданных для декораторов.
 */
declare class MetadataModel<T extends IMetadataModel = any> implements IMetadataModel {
    name: string;
    callback?: T["callback"];
    metadataKey: symbol | string;
    /**
     * Кеш метаданных по prototype.
     * Важно: в библиотеке используются singleton-экземпляры метаданных
     * (fieldMetadata/submitMetadata/validationMetadata/...), поэтому этот кеш
     * эффективно переиспользуется между всеми экземплярами Model.
     */
    private readonly cache;
    private isPrototypeObject;
    /**
     * Получить объект, по которому кешируются метаданные.
     * Для инстанса — это его prototype, для prototype — он сам.
     */
    private getCacheTarget;
    private computeFromPrototype;
    /**
     * Создать базовые метаданные.
     */
    constructor(props?: Partial<T>);
    /**
     * Проверить, что данные соответствуют экземпляру метаданных.
     */
    isInstance(data?: Partial<T>): boolean;
    /**
     * Получить метаданные конкретного поля модели.
     */
    fieldInstance(name: string, target: any): T;
    /**
     * Получить массив метаданных полей модели.
     */
    fields(target: any): T[];
}
/**
 * Метаданные для validation декоратора.
 */
export declare class ValidationMetadata extends MetadataModel<IMetadataModel> {
    metadataKey: symbol;
}
export interface ISubmitMetadata extends IMetadataModel {
    callback?(value: any, instance: any): any;
}
/**
 * Метаданные для submit декоратора.
 */
export declare class SubmitMetadata extends MetadataModel<ISubmitMetadata> implements ISubmitMetadata {
    metadataKey: symbol;
}
export interface IExcludeMetadata extends Omit<IMetadataModel, "callback"> {
    callback?: boolean | ((value: any, instance: any) => boolean);
}
/**
 * Метаданные для exclude декоратора.
 */
export declare class ExcludeMetadata extends MetadataModel<IExcludeMetadata> implements IExcludeMetadata {
    metadataKey: symbol;
}
export interface IFieldMetadata<T = any, I = any> extends IMetadataModel {
    /** метод для переопределения номинального значения */
    factory?: (data: T, instance: I) => any;
    /**
     * метод для переопределения поля в модели
     * @todo - еще не реализован, доделать
     **/
    mapping?: (data: T, instance: I) => any;
    /** не наблюдаемое поле */
    noObserve?: boolean;
    /** имя поля модели */
    name: string;
    /** контекст декоратора поля */
    ctx: ClassFieldDecoratorContext;
    /**
     * признак для отслеживания и фиксации изменений значений у поля модели
     * значения складываются в массивы:
     * @param changes хранит текущие значения в момент изменения
     * @param inverseChanges хранит исходные значения в момент изменения
     * @todo - можно попробовать применить для дебага, на подобии как в девтулсах redux
     * @todo - можно применить если есть необходимость отката к исходному значению по-шагово
     **/
    collectChanges?: boolean;
}
export declare class FieldMetadata extends MetadataModel<IFieldMetadata> implements IFieldMetadata {
    factory?: IFieldMetadata["factory"];
    mapping?: IFieldMetadata["mapping"];
    noObserve?: IFieldMetadata["noObserve"];
    collectChanges?: boolean;
    name: string;
    ctx: ClassFieldDecoratorContext;
    metadataKey: symbol;
    /**
     * Создать метаданные поля модели.
     */
    constructor(props?: Partial<IFieldMetadata>);
}
interface IPropFromViewMetadata extends Omit<IMetadataModel, "callback"> {
    originName: string;
    value: any;
}
export declare class PropFromViewMetadata extends MetadataModel<IPropFromViewMetadata> {
    originName: string;
    value: any;
    metadataKey: symbol;
    /**
     * Создать метаданные для PropFromView.
     */
    constructor(props?: Partial<IPropFromViewMetadata>);
}
export {};
