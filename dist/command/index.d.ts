/**
 * Политика конкурентного выполнения команды.
 *
 * - `"ignore"`   — если команда уже выполняется, повторный `execute()` вернёт текущий `runningPromise` (или `undefined`)
 * - `"restart"`  — при новом `execute()` отменяет текущий запуск (`cancel()`), затем стартует заново
 * - `"queue"`    — ставит вызовы в очередь и выполняет последовательно (FIFO)
 * - `"parallel"` — каждый `execute()` запускается независимо (параллельно)
 */
export type Concurrency = "ignore" | "restart" | "queue" | "parallel";
/**
 * Значения (лейблы) состояний по умолчанию.
 * Можно переопределять через `CommandOptions.states`.
 */
declare const DEFAULT_STATES: {
    readonly load: "load";
    readonly failure: "failure";
    readonly ready: "ready";
    readonly canceled: "canceled";
    readonly disposed: "disposed";
};
type StripAbortSignal<T extends any[]> = T extends [...infer A, infer L] ? (L extends AbortSignal | undefined ? A : T) : T;
type PromiseResult<F> = F extends (...args: any[]) => Promise<infer R> ? R : never;
type GeneratorResult<F> = F extends (...args: any[]) => Generator<any, infer R, any> ? R : F extends (...args: any[]) => AsyncGenerator<any, infer R, any> ? R : never;
/**
 * Набор дефолтных состояний команды.
 */
export type DefaultCommandStates = typeof DEFAULT_STATES;
/**
 * Карта состояний в формате `{ key: label }`.
 * Пример: `{ loading: "loading", success: "success" }`.
 */
export type CommandStatesMap = Record<string, string>;
/**
 * Итоговый набор состояний команды: дефолтные + дополнительные/переопределённые.
 *
 * @template TExtra Дополнительные ключи/лейблы состояний.
 */
export type CommandStates<TExtra extends CommandStatesMap = {}> = Omit<DefaultCommandStates, keyof TExtra> & TExtra;
/**
 * Возможные значения `state` (лейблы) из `states`.
 */
export type CommandStateValue<TStates extends CommandStatesMap> = TStates[keyof TStates & string];
/**
 * Ключи состояний (какие поля в `states` считать load/failure/ready/...).
 * Полезно, если вы хотите хранить состояния под другими ключами.
 *
 * Пример:
 * ```ts
 * stateKeys: { load: "loading", ready: "idle" }
 * states: { loading: "loading", idle: "idle", ... }
 * ```
 */
export type CommandStateKeys<TStates extends CommandStatesMap = CommandStates> = {
    load?: keyof TStates & string;
    failure?: keyof TStates & string;
    ready?: keyof TStates & string;
    canceled?: keyof TStates & string;
    disposed?: keyof TStates & string;
};
/**
 * “Снимок” состояния команды, который прокидывается в `canExecute`.
 */
export type CommandScope<TStates extends CommandStatesMap = CommandStates> = {
    /** Текущее computed-состояние команды (лейбл). */
    state: CommandStateValue<TStates>;
    /** Карта всех лейблов состояний. */
    states: TStates;
    /** Выполняется ли команда сейчас (activeCount > 0). */
    isExecuting: boolean;
    /** Число активных параллельных запусков. */
    activeCount: number;
    /** Была ли команда отменена (cancel()). */
    isCanceled: boolean;
    /** Была ли команда уничтожена (dispose()). */
    isDisposed: boolean;
    /** Последняя ошибка (если trackError=true). */
    error: unknown;
};
/**
 * Опции команды.
 *
 * @template TArgs Аргументы `execute`.
 * @template TExtraStates Дополнительные/кастомные состояния.
 * @template TResult Результат выполнения.
 *
 * @example
 * ```ts
 * const cmd = asyncCommand(fetchUser, {
 *   concurrency: "restart",
 *   abortable: true,
 *   onError: console.error,
 * })
 * ```
 */
export interface CommandOptions<TArgs extends any[], TExtraStates extends CommandStatesMap = {}, TResult = void> {
    /**
     * Предикат, разрешающий выполнение команды.
     * Вызывается с текущим `scope`. Если вернёт `false`, `execute()` не стартует новую операцию.
     */
    canExecute?: (scope: CommandScope<CommandStates<TExtraStates>>) => boolean;
    /** Хук на ошибку (вызывается при исключении, если оно не связано с abort). */
    onError?: (e: unknown) => void;
    /** Хук на отмену (вызывается в `cancel()`). */
    onCancel?: () => void;
    /** Хук перед стартом выполнения (до вызова `fn`). */
    onStart?: (...args: TArgs) => void;
    /** Хук после успешного завершения. */
    onSuccess?: (result: TResult, ...args: TArgs) => void;
    /**
     * Хук в `finally` после завершения (успех/ошибка/отмена).
     * `ok` — было ли успешное завершение,
     * `canceled` — был ли запуск отменён (cancel или abort),
     * `error` — ошибка (если была; для abort обычно null).
     */
    onFinally?: (info: {
        ok: boolean;
        canceled: boolean;
        error: unknown;
    }, ...args: TArgs) => void;
    /**
     * Политика конкурентного выполнения.
     * См. `Concurrency`.
     *
     * @default "ignore"
     */
    concurrency?: Concurrency;
    /**
     * Сохранять ли ошибку в `command.error`.
     *
     * @default true
     */
    trackError?: boolean;
    /**
     * Сбрасывать ли ошибку перед новым запуском (если trackError=true).
     *
     * @default true
     */
    resetErrorOnExecute?: boolean;
    /**
     * “Глотать” ли ошибку: если true — `execute()` вернёт `undefined` вместо throw.
     * Если false — ошибка будет проброшена наружу.
     *
     * @default true
     */
    swallowError?: boolean;
    /**
     * Включить поддержку AbortSignal.
     * Если true — в `fn` будет добавлен последний аргумент `AbortSignal`.
     * При `cancel()` все активные контроллеры будут `abort()`.
     *
     * Важно: `fn` должен уважать сигнал (например, fetch({ signal })).
     *
     * @default false
     */
    abortable?: boolean;
    /**
     * Для concurrency="queue": отменять ли ожидающие элементы очереди при `cancel()`.
     *
     * @default false
     */
    cancelQueued?: boolean;
    /**
     * Для concurrency="queue": максимальный размер очереди.
     * При превышении лимита `execute()` вернёт `undefined`.
     */
    queueLimit?: number;
    /**
     * Расширение/переопределение лейблов состояний.
     * Пример: `{ load: "loading", ready: "idle" }`.
     */
    states?: TExtraStates;
    /**
     * Переопределение того, какие ключи в `states` считать load/ready/failure/...
     * Полезно, если вы хотите иметь, например, `loading` вместо `load`.
     */
    stateKeys?: CommandStateKeys<CommandStates<TExtraStates>>;
}
/**
 * Публичный интерфейс команды.
 *
 * @template TArgs Аргументы `execute`.
 * @template TResult Результат выполнения.
 * @template TExtraStates Дополнительные состояния.
 */
export interface ICommand<TArgs extends any[] = [], TResult = void, TExtraStates extends CommandStatesMap = {}> {
    /**
     * Запускает команду.
     * В зависимости от `concurrency` может:
     * - стартовать сразу,
     * - вернуть текущий запуск,
     * - отменить текущий и стартовать заново,
     * - поставить в очередь,
     * - запустить параллельно.
     */
    execute: (...args: TArgs) => Promise<TResult>;
    /** Можно ли выполнить команду сейчас (computed). */
    readonly canExecute: boolean;
    /** Текущее состояние (computed): load/failure/ready/canceled/disposed или кастомный лейбл. */
    readonly state: CommandStateValue<CommandStates<TExtraStates>>;
    /** Карта лейблов состояний (статичная). */
    readonly states: CommandStates<TExtraStates>;
    /** Выполняется ли сейчас команда (observable). */
    readonly isExecuting: boolean;
    /** Сколько активных выполнений сейчас (observable). */
    readonly activeCount: number;
    /** Флаг отмены (observable). */
    readonly isCanceled: boolean;
    /** Флаг dispose (observable). */
    readonly isDisposed: boolean;
    /** Последняя ошибка (observable, если trackError=true). */
    readonly error: unknown;
    /** Сбросить ошибку. */
    resetError: () => void;
    /**
     * Отменить текущее выполнение.
     * - увеличивает cancelToken (для логической отмены “устаревшего” результата)
     * - выставляет isCanceled=true
     * - вызывает onCancel
     * - abort-ит все активные AbortController (если abortable=true)
     * - может очистить очередь (если cancelQueued=true)
     */
    cancel?: () => void;
    /**
     * Уничтожить команду:
     * - isDisposed=true
     * - очистит очередь
     * - вызовет cancel()
     *
     * После dispose новые `execute()` вернут `undefined`.
     */
    dispose?: () => void;
    /**
     * Для concurrency="queue": очистить очередь ожидания.
     * Все ожидающие промисы резолвятся в `undefined`.
     */
    clearQueue?: () => void;
}
/**
 * Создаёт команду для Promise-функции.
 *
 * @template F Функция вида `(...args) => Promise<TResult>`.
 * @template TExtraStates Дополнительные состояния.
 *
 * @remarks
 * Если `abortable=true`, в `fn` будет добавлен `AbortSignal` последним аргументом.
 *
 * @example
 * ```ts
 * const loadUser = async (id: string, signal?: AbortSignal) => {
 *   const res = await fetch(`/api/users/${id}`, { signal });
 *   return res.json() as Promise<User>;
 * };
 *
 * const cmd = asyncCommand(loadUser, { concurrency: "restart", abortable: true });
 * await cmd.execute("42");
 * ```
 */
export declare function asyncCommand<F extends (...args: any[]) => Promise<any>, TExtraStates extends CommandStatesMap = {}>(fn: F, opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>> & {
    swallowError: false;
}): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;
export declare function asyncCommand<F extends (...args: any[]) => Promise<any>, TExtraStates extends CommandStatesMap = {}>(fn: F, opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>>): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;
/**
 * Создаёт команду для mobx `flow` (generator/async generator).
 *
 * @template F Генераторная функция (yield) или async generator.
 * @template TExtraStates Дополнительные состояния.
 *
 * @remarks
 * Реализация оборачивает `flow(fn)` в `asyncCommand`.
 * При `cancel()` отменяются все активные flow-промисы (через `.cancel?.()`),
 * а ошибки отмены (`isFlowCancellationError`) трактуются как нормальный `undefined`-результат.
 *
 * @example
 * ```ts
 * const load = flowCommand(function* (id: string) {
 *   const res: Response = yield fetch(`/api/users/${id}`);
 *   return (yield res.json()) as User;
 * }, { concurrency: "restart" });
 *
 * await load.execute("42");
 * load.cancel?.();
 * ```
 */
export declare function flowCommand<F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>), TExtraStates extends CommandStatesMap = {}>(fn: F, opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>> & {
    swallowError: false;
}): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;
export declare function flowCommand<F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>), TExtraStates extends CommandStatesMap = {}>(fn: F, opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>>): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;
/**
 * Обёртка над функцией, чтобы гарантировать выполнение внутри `runInAction`.
 * Удобно для методов классов/сторов, когда вы хотите менять observable-состояние
 * без ручных `runInAction`.
 *
 * @template TThis Тип `this`.
 * @template TArgs Аргументы функции.
 * @template TResult Результат.
 *
 * @example
 * ```ts
 * class Store {
 *   value = 0;
 *   inc = commandAction(function (this: Store, by: number) {
 *     this.value += by;
 *   });
 * }
 * ```
 */
export declare function commandAction<TThis, TArgs extends any[], TResult>(fn: (this: TThis, ...args: TArgs) => TResult): (this: TThis, ...args: TArgs) => TResult;
export {};
