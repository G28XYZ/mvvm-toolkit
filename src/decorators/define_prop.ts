import { isDecoratorContext, isLegacyPropertyDecoratorArgs } from "../utils/decorators";

/** Общий тип контекста для field/accessor декораторов. */
export type DefinePropContext<This, T> = ClassFieldDecoratorContext<This, T> | ClassAccessorDecoratorContext<This, T>;

/** Создать декоратор, который определяет свойство с указанными опциями дескриптора. */
function createDefinePropDecorator(options?: PropertyDescriptor) {
  const descriptor: PropertyDescriptor = { enumerable: false, writable: true, ...options };
  // “склеиваем” базовые флаги один раз
  const base: PropertyDescriptor = {
    configurable: true,
    enumerable  : false,
    writable    : true,
    ...options,
  };

  // shared-объект дескриптора именно для этой конфигурации (тоже reuse)
  const shared: PropertyDescriptor = {
    configurable: base.configurable ?? true,
    enumerable  : base.enumerable ?? false,
    writable    : base.writable ?? true,
    value       : undefined,
  };

  return function <This, T>(valueOrTarget: T, contextOrKey: DefinePropContext<This, T> | string | symbol) {
    if (isLegacyPropertyDecoratorArgs(valueOrTarget, contextOrKey)) {
      Object.defineProperty(valueOrTarget, contextOrKey, {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() {
          return undefined;
        },
        set(value: T) {
          // reuse shared descriptor
          shared.value = value;
          Object.defineProperty(this, contextOrKey, shared);
          shared.value = undefined;
          // Object.defineProperty(this, contextOrKey, { value, ...descriptor });
        },
      });
      return;
    }

    if (isDecoratorContext(contextOrKey)) {
      const context = contextOrKey as DefinePropContext<This, T>;
      if (context.kind === "field") {
        return function (this: This, initialValue: T) {
          // Object.defineProperty(this, context.name, { value: initialValue, ...descriptor });
          // reuse shared descriptor, только меняем value
          shared.value = initialValue;
          Object.defineProperty(this, context.name, shared);
          shared.value = undefined;
          return initialValue;
        };
      }

      context.addInitializer(function (this: This) {
        const current = Object.getOwnPropertyDescriptor(this, context.name);
        if (current) {
          Object.defineProperty(this, context.name, { ...current, enumerable: descriptor.enumerable });
        }
      });

      return valueOrTarget;
    }
  };
}

/**
 * Декоратор для определения свойства с не перечисляемым дескриптором по умолчанию.
 * @example
 * class VM {
 *   @define_prop
 *   internalId = 1;
 * }
 */
export function define_prop(value: any, context: any): any;
/**
 * Декоратор для определения свойства с пользовательскими опциями дескриптора.
 * @example
 * class VM {
 *   @define_prop({ enumerable: true })
 *   publicId = 1;
 * }
 */
export function define_prop(options?: PropertyDescriptor): any;
/** Реализация декоратора define_prop. */
export function define_prop(valueOrOptions?: unknown, context?: unknown) {
  if (isLegacyPropertyDecoratorArgs(valueOrOptions, context)) {
    return createDefinePropDecorator()(valueOrOptions, context);
  }

  if (isDecoratorContext(context)) {
    return createDefinePropDecorator()(valueOrOptions, context);
  }

  return createDefinePropDecorator(valueOrOptions);
}
