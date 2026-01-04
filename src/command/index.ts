import { flow, isFlowCancellationError, makeAutoObservable, runInAction } from "mobx";

export type Concurrency = "ignore" | "restart" | "queue" | "parallel";

const DEFAULT_STATES = {
  load: "load",
  failure: "failure",
  ready: "ready",
} as const;

const DEFAULT_STATE_KEYS = {
  load: "load",
  failure: "failure",
  ready: "ready",
} as const;

export type DefaultCommandStates = typeof DEFAULT_STATES;
export type CommandStatesMap = Record<string, string>;
export type CommandStates<TExtra extends CommandStatesMap = {}> = Omit<DefaultCommandStates, keyof TExtra> & TExtra;
export type CommandStateValue<TStates extends CommandStatesMap> = TStates[keyof TStates & string];
export type CommandStateKeys<TStates extends CommandStatesMap = CommandStates> = {
  load?: keyof TStates & string;
  failure?: keyof TStates & string;
  ready?: keyof TStates & string;
};
export type CommandScope<TStates extends CommandStatesMap = CommandStates> = {
  state: CommandStateValue<TStates>;
  states: TStates;
  isExecuting: boolean;
  activeCount: number;
  isCanceled: boolean;
  isDisposed: boolean;
  error: unknown;
};

type AsyncFn<TArgs extends any[], TResult> = (...args: [...TArgs, AbortSignal?]) => Promise<TResult>;
type FlowFn<TArgs extends any[], TResult, TYield = unknown, TNext = unknown> =
  (...args: [...TArgs, AbortSignal?]) => Generator<TYield, TResult, TNext> | AsyncGenerator<TYield, TResult, TNext>;
type FlowPromise<TResult> = Promise<TResult> & { cancel?: () => void };
type QueueEntry<TResult> = {
  promise: Promise<TResult>;
  resolve: (value: TResult | PromiseLike<TResult>) => void;
  reject: (reason?: unknown) => void;
  canceled: boolean;
  settled: boolean;
};

export interface CommandOptions<TArgs extends any[], TExtraStates extends CommandStatesMap = {}, TResult = void> {
  canExecute?: (scope: CommandScope<CommandStates<TExtraStates>>) => boolean;
  onError?: (e: unknown) => void;
  onCancel?: () => void;
  onStart?: (...args: TArgs) => void;
  onSuccess?: (result: TResult, ...args: TArgs) => void;
  onFinally?: (info: { ok: boolean; canceled: boolean; error: unknown }, ...args: TArgs) => void;
  concurrency?: Concurrency;
  trackError?: boolean;
  resetErrorOnExecute?: boolean;
  swallowError?: boolean;
  abortable?: boolean;
  cancelQueued?: boolean;
  queueLimit?: number;
  states?: TExtraStates;
  stateKeys?: CommandStateKeys<CommandStates<TExtraStates>>;
}

export interface ICommand<TArgs extends any[] = [], TResult = void, TExtraStates extends CommandStatesMap = {}> {
  execute: (...args: TArgs) => Promise<TResult>;
  /** computed */
  readonly canExecute: boolean;
  /** computed */
  readonly state: CommandStateValue<CommandStates<TExtraStates>>;
  /** static map of state labels */
  readonly states: CommandStates<TExtraStates>;
  /** observable */
  readonly isExecuting: boolean;
  /** observable */
  readonly activeCount: number;
  /** observable */
  readonly isCanceled: boolean;
  /** observable */
  readonly isDisposed: boolean;
  /** observable */
  readonly error: unknown;
  /** action */
  resetError: () => void;
  /** optional: abort current execution */
  cancel?: () => void;
  /** optional: cleanup */
  dispose?: () => void;
  /** optional: clear queued calls for concurrency="queue" */
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

class AsyncCommandImpl<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>
  implements ICommand<TArgs, TResult, TExtraStates>
{
  isExecuting = false;
  activeCount = 0;
  isCanceled = false;
  isDisposed = false;
  error: unknown = null;
  readonly states: CommandStates<TExtraStates>;

  private readonly fn: AsyncFn<TArgs, TResult>;
  private readonly opt: RequiredOptions<TArgs, TExtraStates, TResult>;
  private readonly stateKeys: CommandStateKeys<CommandStates<TExtraStates>>;

  private readonly controllers = new Set<AbortController>();
  private readonly queue: QueueEntry<TResult>[] = [];
  private runningPromise: Promise<TResult> | null = null;
  private queueTail: Promise<unknown> = Promise.resolve();
  private cancelToken = 0;

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
    this.states = { ...DEFAULT_STATES, ...(opt?.states ?? {}) } as unknown as CommandStates<TExtraStates>;
    this.stateKeys = { ...DEFAULT_STATE_KEYS, ...(opt?.stateKeys ?? {}) } as CommandStateKeys<CommandStates<TExtraStates>>;

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

  get canExecute(): boolean {
    if (this.isDisposed) return false;
    const allowed = this.opt.canExecute ? this.opt.canExecute(this.getScope()) : true;
    if (!allowed) return false;
    if (this.opt.concurrency === "ignore") return !this.isExecuting;
    return true;
  }

  private resolveState(kind: keyof typeof DEFAULT_STATE_KEYS): CommandStateValue<CommandStates<TExtraStates>> {
    const key = (this.stateKeys[kind] ?? kind) as keyof CommandStates<TExtraStates>;
    return (this.states[key] ?? DEFAULT_STATES[kind]) as CommandStateValue<CommandStates<TExtraStates>>;
  }

  private getScope(): CommandScope<CommandStates<TExtraStates>> {
    return {
      state: this.state,
      states: this.states,
      isExecuting: this.isExecuting,
      activeCount: this.activeCount,
      isCanceled: this.isCanceled,
      isDisposed: this.isDisposed,
      error: this.error,
    };
  }

  get state(): CommandStateValue<CommandStates<TExtraStates>> {
    if (this.isExecuting) return this.resolveState("load");
    if (this.error) return this.resolveState("failure");
    return this.resolveState("ready");
  }

  resetError() {
    this.error = null;
  }

  cancel() {
    this.cancelToken += 1;
    this.isCanceled = true;
    this.opt.onCancel?.();
    if (this.opt.cancelQueued) this.clearQueue();
    for (const controller of this.controllers) {
      controller.abort();
    }
  }

  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.clearQueue();
    this.cancel();
  }

  clearQueue() {
    if (this.queue.length === 0) return;
    const pending = this.queue.splice(0, this.queue.length);
    for (const entry of pending) {
      entry.canceled = true;
      if (!entry.settled) {
        entry.settled = true;
        entry.resolve(undefined as TResult);
      }
    }
  }

  execute(...args: TArgs): Promise<TResult> {
    if (this.isDisposed) return Promise.resolve(undefined as TResult);

    if (!this.canExecute) {
      return this.runningPromise ?? Promise.resolve(undefined as TResult);
    }

    const trackPromise = (promise: Promise<TResult>): Promise<TResult> => {
      this.runningPromise = promise;
      const clear = (): void => {
        if (this.runningPromise === promise) this.runningPromise = null;
      };
      promise.then(clear, clear);
      return promise;
    };

    const runOnce = async (): Promise<TResult> => {
      if (this.isDisposed) return undefined as TResult;

      const controller = this.opt.abortable ? new AbortController() : null;
      if (controller) this.controllers.add(controller);

      runInAction(() => {
        this.activeCount += 1;
        this.isExecuting = this.activeCount > 0;
        this.isCanceled = false;
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
        promise = this.fn(...([...args, signal] as any));
        const result = await promise;

        canceled = this.cancelToken !== startCancelToken;
        if (!canceled) {
          this.opt.onSuccess?.(result, ...args);
          ok = true;
        }
        return result;
      } catch (e) {
        if (this.opt.abortable && controller?.signal.aborted) {
          runInAction(() => {
            this.isCanceled = true;
          });
          canceled = true;
          return undefined as TResult;
        }
        error = e;
        canceled = this.cancelToken !== startCancelToken;
        if (this.opt.trackError) {
          runInAction(() => {
            this.error = e;
          });
        }
        this.opt.onError?.(e);
        if (!this.opt.swallowError) throw e;
        return undefined as TResult;
      } finally {
        runInAction(() => {
          this.activeCount = Math.max(0, this.activeCount - 1);
          this.isExecuting = this.activeCount > 0;
        });
        if (controller) this.controllers.delete(controller);
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
          return Promise.resolve(undefined as TResult);
        }

        const entry: QueueEntry<TResult> = {
          promise: Promise.resolve(undefined as TResult),
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
            entry.resolve(undefined as TResult);
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

export function asyncCommand<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>(
  fn: AsyncFn<TArgs, TResult>,
  opt: CommandOptions<TArgs, TExtraStates, TResult> & { swallowError: false }
): ICommand<TArgs, TResult, TExtraStates>;
export function asyncCommand<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>(
  fn: AsyncFn<TArgs, TResult>,
  opt?: CommandOptions<TArgs, TExtraStates, TResult>
): ICommand<TArgs, TResult | undefined, TExtraStates>;
export function asyncCommand<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>(
  fn: AsyncFn<TArgs, TResult>,
  opt?: CommandOptions<TArgs, TExtraStates, TResult>
): ICommand<TArgs, TResult | undefined, TExtraStates> {
  return new AsyncCommandImpl<TArgs, TResult, TExtraStates>(fn, opt);
}

export function flowCommand<
  TArgs extends any[],
  TResult,
  TYield = unknown,
  TNext = unknown,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: FlowFn<TArgs, TResult, TYield, TNext>,
  opt: CommandOptions<TArgs, TExtraStates, TResult> & { swallowError: false }
): ICommand<TArgs, TResult, TExtraStates>;
export function flowCommand<
  TArgs extends any[],
  TResult,
  TYield = unknown,
  TNext = unknown,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: FlowFn<TArgs, TResult, TYield, TNext>,
  opt?: CommandOptions<TArgs, TExtraStates, TResult>
): ICommand<TArgs, TResult | undefined, TExtraStates>;
export function flowCommand<
  TArgs extends any[],
  TResult,
  TYield = unknown,
  TNext = unknown,
  TExtraStates extends CommandStatesMap = {}
>(
  fn: FlowFn<TArgs, TResult, TYield, TNext>,
  opt?: CommandOptions<TArgs, TExtraStates, TResult>
): ICommand<TArgs, TResult | undefined, TExtraStates> {
  const runner = flow(fn);
  const active = new Set<FlowPromise<TResult>>();
  const userOnCancel = opt?.onCancel;

  const cmd = asyncCommand((...args: [...TArgs, AbortSignal?]) => {
    const flowPromise = runner(...args) as FlowPromise<TResult>;
    active.add(flowPromise);

    const cleanup = (): void => {
      active.delete(flowPromise);
    };
    flowPromise.then(cleanup, cleanup);

    return new Promise<TResult>((resolve, reject) => {
      flowPromise.then(resolve, (error) => {
        if (isFlowCancellationError(error as Error)) {
          resolve(undefined as TResult);
          return;
        }
        reject(error);
      });
    });
  }, {
    ...opt,
    onCancel: () => {
      for (const promise of active) {
        promise.cancel?.();
      }
      userOnCancel?.();
    },
  });

  return cmd;
}

export function commandAction<TThis, TArgs extends any[], TResult>(
  fn: (this: TThis, ...args: TArgs) => TResult
): (this: TThis, ...args: TArgs) => TResult {
  return function (this: TThis, ...args: TArgs): TResult {
    return runInAction(() => fn.apply(this, args));
  };
}
