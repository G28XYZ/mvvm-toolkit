export type AnyFieldDecorator<This, T> = (
  targetOrValue: object | undefined,
  contextOrKey: ClassFieldDecoratorContext<This, T> | string | symbol
) => any;