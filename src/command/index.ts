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
 */
export const DEFAULT_STATES = {
  load    : "load",
  failure : "failure",
  ready   : "ready",
  canceled: "canceled",
  disposed: "disposed",
} as const;

type GeneratorResult<F> =
  F extends (...args: unknown[]) => Generator<unknown, infer R, unknown> ? R :
  F extends (...args: unknown[]) => AsyncGenerator<unknown, infer R, unknown> ? R :
  never;

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

type AsyncFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;
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

  /** Карта лейблов состояний (статичная). */
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

type RequiredOptions<TArgs extends unknown[], TResult> = Required<
  Pick<
    CommandOptions<TArgs, TResult>,
    "concurrency" | "trackError" | "resetErrorOnExecute" | "swallowError"
  >
> &
  CommandOptions<TArgs, TResult>;

const noop = (): void => {};

type AsyncCommandObservableKeys =
  | "fn"
  | "opt"
  | "states"
  | "resolveState"
  | "getScope"
  | "queue"
  | "runningPromise"
  | "queueTail"
  | "cancelToken";

/**
 * Внутренняя реализация команды для Promise-функций.
 *
 * Основные задачи:
 * - управление конкурентностью (ignore/restart/queue/parallel)
 * - управление состоянием и ошибками
 * - отмена (логическая cancelToken)
 * - очередь для concurrency="queue"
 */
class AsyncCommandImpl<TArgs extends unknown[], TResult>
  implements ICommand<TArgs, TResult>
{
  isExecuting: boolean  = false;
  activeCount: number   = 0;
  isCanceled : boolean  = false;
  isDisposed : boolean  = false;
  error      : unknown  = null;
  result     : TResult  = undefined;

  readonly states: CommandStates = DEFAULT_STATES;

  private readonly fn: AsyncFn<TArgs, TResult>;
  private readonly opt: RequiredOptions<TArgs, TResult>;

  private readonly queue: QueueEntry<TResult>[] = [];
  private runningPromise: Promise<TResult> | null = null;
  private queueTail: Promise<unknown> = Promise.resolve();
  private cancelToken = 0;

  /**
   * @param fn Асинхронная функция, которую выполняет команда.
   * @param opt Опции команды.
   */
  constructor(fn: AsyncFn<TArgs, TResult>, opt?: CommandOptions<TArgs, TResult>) {
    this.fn = fn;
    this.opt = {
      concurrency: opt?.concurrency ?? "ignore",
      trackError: opt?.trackError ?? true,
      resetErrorOnExecute: opt?.resetErrorOnExecute ?? true,
      swallowError: opt?.swallowError ?? true,
      ...opt,
    };

    makeAutoObservable<this, AsyncCommandObservableKeys>(
      this,
      {
        fn            : false,
        opt           : false,
        states        : false,
        resolveState  : false,
        getScope      : false,
        queue         : false,
        runningPromise: false,
        queueTail     : false,
        cancelToken   : false,
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
   * Разрешает лейбл состояния по “роли” (load/ready/failure/...).
   */
  private resolveState(kind: keyof typeof DEFAULT_STATES): CommandStateValue {
    return DEFAULT_STATES[kind];
  }

  /**
   * Возвращает текущий scope (снимок) для передачи в `canExecute`.
   */
  private getScope(): CommandScope {
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
  get state(): CommandStateValue {
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
   */
  cancel() {
    this.cancelToken += 1;
    this.isCanceled   = true;
    this.result       = undefined;
    this.opt.onCancel?.();
    if (this.opt.cancelQueued) this.clearQueue();
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
   * - при отмене результат принудительно становится `undefined`
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
     * Поднимает activeCount/isExecuting, вызывает хуки и корректно обрабатывает отмену.
     */
    const runOnce = async (): Promise<TResult> => {
      if (this.isDisposed) return undefined;

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

        promise = this.fn(...args);
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
        error = e;

        // Если cancelToken поменялся — считаем запуск отменённым логически.
        canceled = this.cancelToken !== startCancelToken;

        runInAction(() => {
          this.result = undefined; // <-- на ошибке результата нет
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
export function asyncCommand<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  opt: CommandOptions<TArgs, TResult> & { swallowError: false }
): ICommand<TArgs, TResult | undefined>;

export function asyncCommand<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  opt?: CommandOptions<TArgs, TResult>
): ICommand<TArgs, TResult | undefined>;

export function asyncCommand<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  opt?: CommandOptions<TArgs, TResult>
): ICommand<TArgs, TResult | undefined> {
  return new AsyncCommandImpl<TArgs, TResult>(fn, opt);
}

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
export function flowCommand<
  F extends (...args: unknown[]) => (Generator<unknown, unknown, unknown> | AsyncGenerator<unknown, unknown, unknown>)
>(
  fn: F,
  opt: CommandOptions<Parameters<F>, GeneratorResult<F>> & { swallowError: false }
): ICommand<Parameters<F>, GeneratorResult<F> | undefined>;

export function flowCommand<
  F extends (...args: unknown[]) => (Generator<unknown, unknown, unknown> | AsyncGenerator<unknown, unknown, unknown>)
>(
  fn: F,
  opt?: CommandOptions<Parameters<F>, GeneratorResult<F>>
): ICommand<Parameters<F>, GeneratorResult<F> | undefined>;

export function flowCommand<
  F extends (...args: unknown[]) => (Generator<unknown, unknown, unknown> | AsyncGenerator<unknown, unknown, unknown>)
>(
  fn: F,
  opt?: CommandOptions<Parameters<F>, GeneratorResult<F>>
): ICommand<Parameters<F>, GeneratorResult<F> | undefined> {
  const runner = flow(fn) as (...args: Parameters<F>) => FlowPromise<GeneratorResult<F>>;
  const active = new Set<FlowPromise<GeneratorResult<F>>>();
  const userOnCancel = opt?.onCancel;

  const cmd = asyncCommand<Parameters<F>, GeneratorResult<F>>((...args: Parameters<F>) => {
    const flowPromise = runner(...args);
    active.add(flowPromise);

    const cleanup = (): void => {
      active.delete(flowPromise);
    };
    flowPromise.then(cleanup, cleanup);

    return new Promise<GeneratorResult<F> | undefined>((resolve, reject) => {
      flowPromise.then(resolve, (error: Error) => {
        const err = error;
        if (isFlowCancellationError(err)) {
          resolve(undefined);
          return;
        }
        reject(err);
      });
    });
  }, {
    ...opt,
    onCancel: () => {
      for (const promise of active) promise.cancel?.();
      userOnCancel?.();
    },
  });
  return cmd;
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
export function commandAction<TThis, TArgs extends unknown[], TResult>(
  fn: (this: TThis, ...args: TArgs) => TResult
): (this: TThis, ...args: TArgs) => TResult {
  return function (this: TThis, ...args: TArgs): TResult {
    return runInAction(() => fn.apply(this, args));
  };
}

export * from './service';
