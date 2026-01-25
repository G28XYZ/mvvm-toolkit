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
 */
export declare const DEFAULT_STATES: {
    readonly load: "load";
    readonly failure: "failure";
    readonly ready: "ready";
    readonly canceled: "canceled";
    readonly disposed: "disposed";
};
type GeneratorResult<F> = F extends (...args: unknown[]) => Generator<unknown, infer R, unknown> ? R : F extends (...args: unknown[]) => AsyncGenerator<unknown, infer R, unknown> ? R : never;
/**
 * Набор дефолтных состояний команды.
 */
export type DefaultCommandStates = typeof DEFAULT_STATES;
/**
 * Набор состояний команды.
 */
export type CommandStates = DefaultCommandStates;
/**
 * Возможные значения `state` (лейблы) из `states`.
 */
export type CommandStateValue = CommandStates[keyof CommandStates & string];
/**
 * “Снимок” состояния команды, который прокидывается в `canExecute`.
 */
export type CommandScope = {
    /** Текущее computed-состояние команды (лейбл). */
    state: CommandStateValue;
    /** Карта всех лейблов состояний. */
    states: CommandStates;
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
    /** Последний результат выполнения (успех -> TResult, ошибка/отмена -> undefined) */
    result: unknown;
};
/**
 * Опции команды.
 *
 * @template TArgs Аргументы `execute`.
 * @template TResult Результат выполнения.
 *
 * @example
 * ```ts
 * const cmd = asyncCommand(fetchUser, {
 *   concurrency: "restart",
 *   onError: console.error,
 * })
 * ```
 */
export interface CommandOptions<TArgs extends unknown[], TResult = void> {
    /**
     * Предикат, разрешающий выполнение команды.
     * Вызывается с текущим `scope`. Если вернёт `false`, `execute()` не стартует новую операцию.
     */
    canExecute?: (scope: CommandScope) => boolean;
    /** Хук на ошибку (вызывается при исключении). */
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
     * `canceled` — был ли запуск отменён (cancel),
     * `error` — ошибка (если была).
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
}
/**
 * Публичный интерфейс команды.
 *
 * @template TArgs Аргументы `execute`.
 * @template TResult Результат выполнения.
 */
export interface ICommand<TArgs extends unknown[] = [], TResult = void> {
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
    /** Текущее состояние (computed): load/failure/ready/canceled/disposed. */
    readonly state: CommandStateValue;
    /**
     * Карта лейблов состояний (статичная).
     *
     * @example
     * ```ts
     * if (cmd.state === cmd.states.ready) {
     *   // можно запускать
     * }
     * ```
     */
    readonly states: CommandStates;
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
    /** Последний результат выполнения (успех -> TResult, ошибка/отмена -> undefined) */
    readonly result: TResult;
    /** Сбросить ошибку. */
    resetError: () => void;
    /**
     * Отменить текущее выполнение.
     * - увеличивает cancelToken (для логической отмены “устаревшего” результата)
     * - выставляет isCanceled=true
     * - вызывает onCancel
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
 *
 * @remarks
 * @example
 * ```ts
 * const loadUser = async (id: string) => {
 *   const res = await fetch(`/api/users/${id}`);
 *   return res.json() as Promise<User>;
 * };
 *
 * const cmd = asyncCommand(loadUser, { concurrency: "restart" });
 * await cmd.execute("42");
 * ```
 */
export declare function asyncCommand<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>, opt: CommandOptions<TArgs, TResult> & {
    swallowError: false;
}): ICommand<TArgs, TResult | undefined>;
export declare function asyncCommand<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>, opt?: CommandOptions<TArgs, TResult>): ICommand<TArgs, TResult | undefined>;
/**
 * Создаёт команду для mobx `flow` (generator/async generator).
 *
 * @template F Генераторная функция (yield) или async generator.
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
export declare function flowCommand<F extends (...args: unknown[]) => (Generator<unknown, unknown, unknown> | AsyncGenerator<unknown, unknown, unknown>)>(fn: F, opt: CommandOptions<Parameters<F>, GeneratorResult<F>> & {
    swallowError: false;
}): ICommand<Parameters<F>, GeneratorResult<F> | undefined>;
export declare function flowCommand<F extends (...args: unknown[]) => (Generator<unknown, unknown, unknown> | AsyncGenerator<unknown, unknown, unknown>)>(fn: F, opt?: CommandOptions<Parameters<F>, GeneratorResult<F>>): ICommand<Parameters<F>, GeneratorResult<F> | undefined>;
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
export declare function commandAction<TThis, TArgs extends unknown[], TResult>(fn: (this: TThis, ...args: TArgs) => TResult): (this: TThis, ...args: TArgs) => TResult;
export * from './service';
