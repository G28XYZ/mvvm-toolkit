import { flow, isFlowCancellationError, makeAutoObservable, runInAction } from "mobx";

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
const DEFAULT_STATES = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed",
} as const;

/**
 * Ключи состояний по умолчанию.
 * Нужны, чтобы можно было “переименовать” ключи (например, вместо `load` использовать `loading`)
 * через `CommandOptions.stateKeys`, но при этом сохранить типовую совместимость.
 */
const DEFAULT_STATE_KEYS = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed",
} as const;

type StripAbortSignal<T extends any[]> =
  T extends [...infer A, infer L]
    ? ([L] extends [AbortSignal | undefined] ? A : T)
    : T;

type PromiseResult<F> = F extends (...args: any[]) => Promise<infer R> ? R : never;

type GeneratorResult<F> =
  F extends (...args: any[]) => Generator<any, infer R, any> ? R :
  F extends (...args: any[]) => AsyncGenerator<any, infer R, any> ? R :
  never;

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
export type CommandStates<TExtra extends CommandStatesMap = {}> =
  Omit<DefaultCommandStates, keyof TExtra> & TExtra;

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
  /** Последний результат выполнения (успех -> TResult, ошибка/отмена -> undefined) */
  result: unknown;
};

type AsyncFn<TArgs extends any[], TResult> = (...args: [...TArgs, AbortSignal?]) => Promise<TResult>;
type FlowPromise<TResult> = Promise<TResult> & { cancel?: () => void };

type QueueEntry<TResult> = {
  promise: Promise<TResult>;
  resolve: (value: TResult | PromiseLike<TResult>) => void;
  reject: (reason?: unknown) => void;
  canceled: boolean;
  settled: boolean;
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
  onFinally?: (info: { ok: boolean; canceled: boolean; error: unknown }, ...args: TArgs) => void;

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
  /** Последний результат выполнения (успех -> TResult, ошибка/отмена -> undefined) */
  readonly result: TResult;

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

type RequiredOptions<TArgs extends any[], TExtraStates extends CommandStatesMap, TResult> = Required<
  Pick<
    CommandOptions<TArgs, TExtraStates, TResult>,
    "concurrency" | "trackError" | "resetErrorOnExecute" | "swallowError" | "abortable"
  >
> &
  CommandOptions<TArgs, TExtraStates, TResult>;

const noop = (): void => {};

/**
 * Внутренняя реализация команды для Promise-функций.
 *
 * Основные задачи:
 * - управление конкурентностью (ignore/restart/queue/parallel)
 * - управление состоянием и ошибками
 * - отмена (логическая cancelToken + AbortController при abortable=true)
 * - очередь для concurrency="queue"
 */
class AsyncCommandImpl<TArgs extends any[], TResult extends (undefined | unknown), TExtraStates extends CommandStatesMap = {}>
  implements ICommand<TArgs, TResult, TExtraStates>
{
  isExecuting: boolean  = false;
  activeCount: number   = 0;
  isCanceled : boolean  = false;
  isDisposed : boolean  = false;
  error      : unknown  = null;
  result     : TResult  = undefined;

  readonly states: CommandStates<TExtraStates>;

  private readonly fn: AsyncFn<TArgs, TResult>;
  private readonly opt: RequiredOptions<TArgs, TExtraStates, TResult>;
  private readonly stateKeys: CommandStateKeys<CommandStates<TExtraStates>>;

  private readonly controllers = new Set<AbortController>();
  private readonly queue: QueueEntry<TResult>[] = [];
  private runningPromise: Promise<TResult> | null = null;
  private queueTail: Promise<unknown> = Promise.resolve();
  private cancelToken = 0;


  /**
   * @param fn Асинхронная функция, которую выполняет команда.
   *           Если `abortable=true`, в неё будет передан `AbortSignal` последним аргументом.
   * @param opt Опции команды.
   */
  constructor(fn: AsyncFn<TArgs, TResult>, opt?: CommandOptions<TArgs, TExtraStates, TResult>) {
    this.fn = fn;
    this.opt = {
      concurrency: opt?.concurrency ?? "ignore",
      trackError: opt?.trackError ?? true,
      resetErrorOnExecute: opt?.resetErrorOnExecute ?? true,
      swallowError: opt?.swallowError ?? true,
      abortable: opt?.abortable ?? false,
      ...opt,
    };

    // TODO types
    this.states = { ...DEFAULT_STATES, ...(opt?.states ?? {}) } as any;
    this.stateKeys = { ...DEFAULT_STATE_KEYS, ...(opt?.stateKeys ?? {}) };

    makeAutoObservable<
      this,
      | "fn"
      | "opt"
      | "states"
      | "stateKeys"
      | "resolveState"
      | "getScope"
      | "controllers"
      | "queue"
      | "runningPromise"
      | "queueTail"
      | "cancelToken"
    >(
      this,
      {
        fn: false,
        opt: false,
        states: false,
        stateKeys: false,
        resolveState: false,
        getScope: false,
        controllers: false,
        queue: false,
        runningPromise: false,
        queueTail: false,
        cancelToken: false,
      },
      { autoBind: true }
    );
  }

  /**
   * Можно ли выполнить команду прямо сейчас.
   * Учитывает:
   * - dispose
   * - `opt.canExecute(scope)`
   * - политику конкурентности: для `"ignore"` запрещает запуск при `isExecuting=true`
   */
  get canExecute(): boolean {
    if (this.isDisposed) return false;
    const allowed = this.opt.canExecute ? this.opt.canExecute(this.getScope()) : true;
    if (!allowed) return false;
    if (this.opt.concurrency === "ignore") return !this.isExecuting;
    return true;
  }

  /**
   * Разрешает лейбл состояния по “роли” (load/ready/failure/...) с учётом stateKeys/states.
   */
  private resolveState(kind: keyof typeof DEFAULT_STATE_KEYS): CommandStateValue<CommandStates<TExtraStates>> {
    const key = (this.stateKeys[kind] ?? kind);
    // TODO types
    return (this.states[key] ?? DEFAULT_STATES[kind]) as CommandStateValue<CommandStates<TExtraStates>>;
  }

  /**
   * Возвращает текущий scope (снимок) для передачи в `canExecute`.
   */
  private getScope(): CommandScope<CommandStates<TExtraStates>> {
    return {
      state      : this.state,
      states     : this.states,
      isExecuting: this.isExecuting,
      activeCount: this.activeCount,
      isCanceled : this.isCanceled,
      isDisposed : this.isDisposed,
      error      : this.error,
      result     : this.result
    };
  }

  /**
   * Computed “машина состояний”.
   *
   * Приоритет:
   * 1) disposed
   * 2) load (если выполняется)
   * 3) failure (если есть error)
   * 4) canceled (если isCanceled)
   * 5) ready
   */
  get state(): CommandStateValue<CommandStates<TExtraStates>> {
     if (this.isDisposed) return this.resolveState("disposed");
     if (this.isExecuting) return this.resolveState("load");
     if (this.error) return this.resolveState("failure");
     if (this.isCanceled) return this.resolveState("canceled");
    return this.resolveState("ready");
  }

  /**
   * Сбрасывает `error`.
   */
  resetError() {
    this.error = null;
  }

  /**
   * Отменяет текущие активные выполнения:
   * - увеличивает cancelToken (помечает текущий запуск “устаревшим”)
   * - ставит isCanceled=true
   * - вызывает onCancel
   * - при cancelQueued=true — очищает очередь
   * - при abortable=true — abort() все активные AbortController
   */
  cancel() {
    this.cancelToken += 1;
    this.isCanceled   = true;
    this.result       = undefined;
    this.opt.onCancel?.();
    if (this.opt.cancelQueued) this.clearQueue();
    for (const controller of this.controllers) {
      controller.abort();
    }
  }

  /**
   * Помечает команду как уничтоженную, очищает очередь и отменяет активные выполнения.
   * После dispose новые execute() не выполняются.
   */
  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.result     = undefined;
    this.clearQueue();
    this.cancel();
  }

  /**
   * Очищает очередь (concurrency="queue").
   * Все ожидающие элементы резолвятся в `undefined`.
   */
  clearQueue() {
    if (this.queue.length === 0) return;
    const pending = this.queue.splice(0, this.queue.length);
    for (const entry of pending) {
      entry.canceled = true;
      if (!entry.settled) {
        entry.settled = true;
        entry.resolve(undefined);
      }
    }
  }

  /**
   * Выполняет команду с учётом выбранной конкурентности.
   *
   * @remarks
   * Возвращаемое значение часто типизируется как `TResult | undefined`, потому что:
   * - при отмене/abort результат принудительно становится `undefined`
   * - при swallowError=true ошибка не пробрасывается, а возвращается `undefined`
   */
  execute(...args: TArgs): Promise<TResult> {
    if (this.isDisposed) return Promise.resolve(undefined);

    if (!this.canExecute) {
      return this.runningPromise ?? Promise.resolve(undefined);
    }

    const trackPromise = (promise: Promise<TResult>): Promise<TResult> => {
      this.runningPromise = promise;
      const clear = (): void => {
        if (this.runningPromise === promise) this.runningPromise = null;
      };
      promise.then(clear, clear);
      return promise;
    };

    /**
     * Один запуск выполнения (внутренняя “транзакция”).
     * Поднимает activeCount/isExecuting, создаёт AbortController при abortable=true,
     * вызывает хуки и корректно обрабатывает отмену.
     */
    const runOnce = async (): Promise<TResult> => {
      if (this.isDisposed) return undefined;

      const controller = this.opt.abortable ? new AbortController() : null;
      if (controller) this.controllers.add(controller);

      runInAction(() => {
        this.activeCount += 1;
        this.isExecuting  = this.activeCount > 0;
        this.isCanceled   = false;
        this.result       = undefined;
        if (this.opt.trackError && this.opt.resetErrorOnExecute) this.error = null;
      });

      const startCancelToken = this.cancelToken;
      let ok = false;
      let canceled = false;
      let error: unknown = null;

      let promise: Promise<TResult> | null = null;
      try {
        this.opt.onStart?.(...args);

        const signal = this.opt.abortable ? controller!.signal : undefined;
        promise = this.fn(...([...args, signal]));
        const result = await promise;

        // Логическая отмена: если cancelToken изменился, считаем, что результат устарел.
        canceled = this.cancelToken !== startCancelToken;
        if (canceled) {
          runInAction(() => {
            this.isCanceled = true;
            this.result = undefined;
          });
          return undefined;
        }

        runInAction(() => { this.result = result; });

        this.opt.onSuccess?.(result, ...args);
        ok = true;
        return result;
      } catch (e) {
        // Abort-отмена: если abortable и сигнал aborted — трактуем как cancel без ошибки.
        if (this.opt.abortable && controller?.signal.aborted) {
          runInAction(() => {
            this.isCanceled = true;
            this.result     = undefined;
          });
          canceled = true;
          error = null;
          return undefined;
        }
        error = e;

        // Если cancelToken поменялся — считаем запуск отменённым логически.
        canceled = this.cancelToken !== startCancelToken;

        runInAction(() => {
          this.result = undefined as TResult; // <-- на ошибке результата нет
          if (this.opt.trackError) this.error = e;
        });
        this.opt.onError?.(e);

        if (!this.opt.swallowError) throw e;
        return undefined;
      } finally {
        runInAction(() => {
          this.activeCount = Math.max(0, this.activeCount - 1);
          this.isExecuting = this.activeCount > 0;
        });
        if (controller) this.controllers.delete(controller);

        // На случай, если cancelToken обновился уже после try/catch.
        if (!canceled && this.cancelToken !== startCancelToken) {
          canceled = true;
        }

        this.opt.onFinally?.({ ok, canceled, error }, ...args);
      }
    };

    switch (this.opt.concurrency) {
      case "parallel":
        return trackPromise(runOnce());

      case "restart":
        this.cancel();
        return trackPromise(runOnce());

      case "queue": {
        const limit = this.opt.queueLimit;
        if (typeof limit === "number" && limit > 0 && this.queue.length >= limit) {
          return Promise.resolve(undefined);
        }

        const entry: QueueEntry<TResult> = {
          promise: Promise.resolve(undefined),
          resolve: noop,
          reject: noop,
          canceled: false,
          settled: false,
        };

        const isIdle = this.activeCount === 0 && this.queue.length === 0;

        entry.promise = new Promise<TResult>((resolve, reject) => {
          entry.resolve = resolve;
          entry.reject = reject;
        });

        this.queue.push(entry);

        const runQueued = async (): Promise<void> => {
          if (entry.settled) return;
          if (entry.canceled || this.isDisposed) {
            entry.settled = true;
            entry.resolve(undefined);
            return;
          }

          const index = this.queue.indexOf(entry);
          if (index >= 0) this.queue.splice(index, 1);

          try {
            const result = await runOnce();
            if (!entry.settled) {
              entry.settled = true;
              entry.resolve(result);
            }
          } catch (error) {
            if (!entry.settled) {
              entry.settled = true;
              entry.reject(error);
            }
          }
        };

        // Гарантируем последовательность выполнения элементов очереди.
        const next = isIdle ? runQueued() : this.queueTail.then(runQueued, runQueued);
        this.queueTail = next.then(noop, noop);

        return trackPromise(entry.promise);
      }

      case "ignore":
      default:
        if (this.isExecuting && this.runningPromise) return this.runningPromise;
        return trackPromise(runOnce());
    }
  }
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
export function asyncCommand<
  F extends (...args: any[]) => Promise<any>,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>> & { swallowError: false }
): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;

export function asyncCommand<
  F extends (...args: any[]) => Promise<any>,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>>
): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;

export function asyncCommand<
  F extends (...args: any[]) => Promise<any>,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>>
): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates> {
  return new AsyncCommandImpl<any, any, any>(fn, opt);
}

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
export function flowCommand<
  F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>),
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>> & { swallowError: false }
): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;

export function flowCommand<
  F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>),
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>>
): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;

export function flowCommand<
  F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>),
  TExtraStates extends CommandStatesMap = {}
>(
  fn: F,
  opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>>
): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates> {
  const runner = flow(fn);
  const active = new Set<FlowPromise<any>>();
  const userOnCancel = opt?.onCancel;

  const cmd = asyncCommand((...args: any[]) => {
    const flowPromise = runner(...args);
    active.add(flowPromise);

    const cleanup = (): void => {
      active.delete(flowPromise);
    };
    flowPromise.then(cleanup, cleanup);

    return new Promise<any>((resolve, reject) => {
      flowPromise.then(resolve, (error: Error) => {
        if (isFlowCancellationError(error)) {
          resolve(undefined);
          return;
        }
        reject(error);
      });
    });
  }, {
    // TODO types
    ...(opt as any),
    onCancel: () => {
      for (const promise of active) promise.cancel?.();
      userOnCancel?.();
    },
  });
  // TODO types
  return cmd as any;
}

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
export function commandAction<TThis, TArgs extends any[], TResult>(
  fn: (this: TThis, ...args: TArgs) => TResult
): (this: TThis, ...args: TArgs) => TResult {
  return function (this: TThis, ...args: TArgs): TResult {
    return runInAction(() => fn.apply(this, args));
  };
}
