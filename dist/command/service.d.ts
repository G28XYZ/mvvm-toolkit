type CommandMethodsMap<T> = Partial<Record<keyof T & string, string | boolean>>;
/**
 * Итоговый словарь состояний, который видит потребитель класса.
 */
declare const SERVICE_STATES: {
    readonly load: "loading";
    readonly save: "saving";
    readonly remove: "removing";
    readonly delete: "deleting";
    readonly failure: "failure";
    readonly ready: "ready";
    readonly canceled: "canceled";
    readonly disposed: "disposed";
};
type ServiceState = typeof SERVICE_STATES[keyof typeof SERVICE_STATES];
type CommandServiceType = {
    state: string;
    states: Record<string, string>;
    isExecuting: boolean;
    activeCount: number;
    isCanceled: boolean;
    isDisposed: boolean;
    error: unknown;
    result: unknown;
    resetError?: () => void;
    cancel?: () => void;
    dispose?: () => void;
    clearQueue?: () => void;
};
/**
 * Преобразует методы в команды и подмешивает состояние к экземпляру.
 */
export declare function applyCommandMethods<T extends CommandServiceType>(target: T, map?: CommandMethodsMap<T>): void;
/**
 * Базовый класс для обертки методов в команды.
 * Применяет логику команд в конструкторе.
 */
export declare class CommandService implements CommandServiceType {
    state: ServiceState;
    states: typeof SERVICE_STATES;
    isExecuting: boolean;
    activeCount: number;
    isCanceled: boolean;
    isDisposed: boolean;
    error: unknown;
    result: unknown;
    resetError?: () => void;
    cancel?: () => void;
    dispose?: () => void;
    clearQueue?: () => void;
    constructor();
}
export {};
