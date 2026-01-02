export type LegacyPropertyKey = string | symbol;

export const isLegacyPropertyDecoratorArgs = (target: unknown, propertyKey: unknown): propertyKey is LegacyPropertyKey =>
  !!target && (typeof propertyKey === "string" || typeof propertyKey === "symbol");

export const isDecoratorContext = (context: unknown): context is { kind: string; name: string | symbol; addInitializer?: (initializer: () => void) => void } =>
  !!context && typeof context === "object" && "kind" in context;

export const createLegacyClassContext = (name: string | symbol) =>
  ({
    kind: "class",
    name,
    addInitializer: (): void => void 0,
    metadata: {},
  }) as unknown as ClassDecoratorContext<any>;
