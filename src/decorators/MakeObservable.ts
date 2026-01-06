import { makeObservable } from "mobx";
import { TInstance } from "../utils";
import { isDecoratorContext } from "../utils/decorators";

/**
 * Декоратор для автоматического вызова makeObservable в конструкторе.
 * @example
 * @MakeObservable
 * class VM {
 *   @observable accessor count = 0;
 * }
 */
export function MakeObservable<This extends object, Args extends any[]>(): (
  t: TInstance<This, Args>,
  ctx?: ClassDecoratorContext<TInstance<This, Args>>
) => TInstance<This, Args> | void;
/**
 *
 * @param t
 * @param ctx
 */
export function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>, ctx: ClassDecoratorContext<TInstance<This, Args>>): void;
export function MakeObservable<This extends object, Args extends any[]>(t: TInstance<This, Args>): TInstance<This, Args> | void;
/**
 *
 * @param t
 * @param ctx
 * @returns
 */
export function MakeObservable<This extends object, Args extends any[]>(
  t?: TInstance<This, Args>,
  ctx?: ClassDecoratorContext<TInstance<This, Args>>
): TInstance<This, Args> | void | ((t: TInstance<This, Args>, ctx?: ClassDecoratorContext<TInstance<This, Args>>) => TInstance<This, Args> | void) {
  const decorateLegacy = <T extends new (...args: any[]) => object>(target: T) =>
    class extends target {
      constructor(...args: any[]) {
        super(...args);
        makeObservable(this);
      }
    };
  const copyLegacyMetadata = <T extends new (...args: any[]) => object>(source: T, next: T) => {
    if (typeof Reflect?.getOwnMetadataKeys !== "function") return;
    for (const key of Reflect.getOwnMetadataKeys(source)) {
      const value = Reflect.getOwnMetadata(key, source);
      Reflect.defineMetadata(key, value, next);
    }
  };

  function callback(target: TInstance<This, Args>, context?: ClassDecoratorContext<TInstance<This, Args>>) {
    if (!isDecoratorContext(context)) {
      const source = target as new (...args: any[]) => object;
      const next = decorateLegacy(source) as TInstance<This, Args>;
      Object.defineProperty(next, "__mvvm_legacy_source__", { value: source, configurable: true });
      copyLegacyMetadata(source, next as new (...args: any[]) => object);
      return next;
    }
    context.addInitializer(function (this) {
      makeObservable(this);
    });
  }

  if (t && !isDecoratorContext(ctx)) return callback(t, ctx);

  if (t) return callback(t, ctx);

  return callback;
}