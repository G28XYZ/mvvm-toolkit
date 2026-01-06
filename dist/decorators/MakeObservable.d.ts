import { TInstance } from "../utils";
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
