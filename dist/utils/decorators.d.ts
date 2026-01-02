export type LegacyPropertyKey = string | symbol;
export declare const isLegacyPropertyDecoratorArgs: (target: unknown, propertyKey: unknown) => propertyKey is LegacyPropertyKey;
export declare const isDecoratorContext: (context: unknown) => context is {
    kind: string;
    name: string | symbol;
    addInitializer?: (initializer: () => void) => void;
};
export declare const createLegacyClassContext: (name: string | symbol) => ClassDecoratorContext<any>;
