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
 *
 * Примеры использования состояния:
 *
 * @example
 * ```ts
 * class UserService extends CommandService {
 *   async load(id: string) {
 *     // ...fetch
 *   }
 *
 *   async save(data: User) {
 *     // ...post
 *   }
 * }
 *
 * const svc = new UserService();
 * await svc.load("u1");
 *
 * if (svc.state === svc.states.loading) {
 *   // показываем спиннер загрузки
 * }
 *
 * if (svc.state === svc.states.ready) {
 *   // можно рендерить данные
 * }
 *
 * if (svc.state === svc.states.failure) {
 *   // показать ошибку svc.error
 * }
 * ```
 *
 * @example
 * ```ts
 * class UserService extends CommandService {
 *   async fetchUser() {}
 *   async updateUser() {}
 *
 *   constructor() {
 *     super();
 *     applyCommandMethods(this, {
 *       fetchUser: "fetching-user",
 *       updateUser: "updating-user",
 *     });
 *   }
 * }
 *
 * const svc = new UserService();
 * await svc.fetchUser();
 *
 * if (svc.state === "fetching-user") {
 *   // специфичный UI для fetchUser
 * }
 * ```
 *
 * @example
 * ```ts
 * const svc = new UserService();
 *
 * svc.load("u1").catch(() => {});
 * if (svc.state === svc.states.failure) {
 *   console.log(svc.error);
 *   svc.resetError?.();
 * }
 *
 * svc.load("u2");
 * svc.cancel?.(); // state -> canceled, isCanceled=true
 * ```
 *
 * @example
 * ```ts
 * await svc.save({ id: "u1", name: "Alice" });
 *
 * if (svc.isExecuting) {
 *   // если команда еще идет
 * }
 *
 * console.log("last result:", svc.result);
 * ```
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
