/**
 * Получить metadata с учетом значения по умолчанию.
 */
export declare const getOwnMetadata: <T, D = any>(metadataKey: symbol | string, target: T, defaultValue?: D) => D extends undefined ? T : D;
/**
 * Определить metadata на объекте.
 */
export declare const defineMetadata: <V, T = any>(metadataKey: symbol | string, metadataValue: V, target: T) => void;
/**
 * Проверить, можно ли сериализовать аргументы.
 */
export declare function isSerializable(...args: any[]): boolean;
/**
 * Извлечь имя вызывающей функции из stack.
 */
export declare function getExecutingFunctionNameByStack(stack: string): string;
/**
 * Отложенная запись TODO в консоль с уникальными путями.
 */
export declare const TODO: (title: string, ...msg: any[]) => (...args: any[]) => void;
/** Тип конструктора класса. */
export type TInstance<T = any, A extends any[] = any[]> = new (...args: A) => T;
