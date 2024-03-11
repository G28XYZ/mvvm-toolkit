export const ApplyDecorators = (decorators: Array<(...args: any[]) => any> = []) => {
  return <T extends new (...args: any[]) => any>(base: T) => {
    const mapDecorator = decorators.map((item) => (base: T) => item(base) || base);

    return mapDecorator.reduce((b, c) => c(base) || base, base);
  };
};
