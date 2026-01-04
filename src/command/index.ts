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
  error: unknown;
};

type AsyncFn<TArgs extends any[], TResult> = (...args: [...TArgs, AbortSignal?]) => Promise<TResult>;
type FlowFn<TArgs extends any[], TResult, TYield = unknown, TNext = unknown> =
  (...args: [...TArgs, AbortSignal?]) => Generator<TYield, TResult, TNext> | AsyncGenerator<TYield, TResult, TNext>;
type FlowPromise<TResult> = Promise<TResult> & { cancel?: () => void };

export interface CommandOptions<TArgs extends any[], TExtraStates extends CommandStatesMap = {}> {
  canExecute?: (scope: CommandScope<CommandStates<TExtraStates>>) => boolean;
  onError?: (e: unknown) => void;
  onCancel?: () => void;
  concurrency?: Concurrency;
  trackError?: boolean;
  swallowError?: boolean;
  abortable?: boolean;
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
  readonly error: unknown;
  /** action */
  resetError: () => void;
  /** optional: abort current execution */
  cancel?: () => void;
  /** optional: cleanup */
  dispose?: () => void;
}

type RequiredOptions<TArgs extends any[], TExtraStates extends CommandStatesMap> = Required<
  Pick<CommandOptions<TArgs, TExtraStates>, "concurrency" | "trackError" | "swallowError" | "abortable">
> &
  CommandOptions<TArgs, TExtraStates>;

const noop = (): void => {};

class AsyncCommandImpl<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>
  implements ICommand<TArgs, TResult, TExtraStates>
{
  isExecuting = false;
  error: unknown = null;
  readonly states: CommandStates<TExtraStates>;

  private readonly fn: AsyncFn<TArgs, TResult>;
  private readonly opt: RequiredOptions<TArgs, TExtraStates>;
  private readonly stateKeys: CommandStateKeys<CommandStates<TExtraStates>>;

  private readonly controllers = new Set<AbortController>();
  private runningCount = 0;
  private runningPromise: Promise<TResult> | null = null;
  private queueTail: Promise<unknown> = Promise.resolve();
  private disposed = false;

  constructor(fn: AsyncFn<TArgs, TResult>, opt?: CommandOptions<TArgs, TExtraStates>) {
    this.fn = fn;
    this.opt = {
      concurrency: opt?.concurrency ?? "ignore",
      trackError: opt?.trackError ?? true,
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
      | "runningCount"
      | "runningPromise"
      | "queueTail"
      | "disposed"
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
        runningCount: false,
        runningPromise: false,
        queueTail: false,
        disposed: false,
      },
      { autoBind: true }
    );
  }

  get canExecute(): boolean {
    if (this.disposed) return false;
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
    this.opt.onCancel?.();
    for (const controller of this.controllers) {
      controller.abort();
    }
  }

  dispose() {
    this.disposed = true;
    this.cancel();
  }

  execute(...args: TArgs): Promise<TResult> {
    if (this.disposed) return Promise.resolve(undefined as TResult);

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
      if (this.disposed) return undefined as TResult;

      const controller = this.opt.abortable ? new AbortController() : null;
      if (controller) this.controllers.add(controller);

      runInAction(() => {
        this.runningCount += 1;
        this.isExecuting = this.runningCount > 0;
        if (this.opt.trackError) this.error = null;
      });

      let promise: Promise<TResult> | null = null;
      try {
        const signal = this.opt.abortable ? controller!.signal : undefined;
        promise = this.fn(...([...args, signal] as any));
        const result = await promise;
        return result;
      } catch (e) {
        if (this.opt.abortable && controller?.signal.aborted) {
          return undefined as TResult;
        }
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
          this.runningCount = Math.max(0, this.runningCount - 1);
          this.isExecuting = this.runningCount > 0;
        });
        if (controller) this.controllers.delete(controller);
      }
    };

    switch (this.opt.concurrency) {
      case "parallel":
        return trackPromise(runOnce());

      case "restart":
        this.cancel();
        return trackPromise(runOnce());

      case "queue": {
        const next = this.queueTail.then(runOnce, runOnce);
        this.queueTail = next.then(noop, noop);
        return trackPromise(next);
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
  opt?: CommandOptions<TArgs, TExtraStates>
): ICommand<TArgs, TResult, TExtraStates> {
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
  opt?: CommandOptions<TArgs, TExtraStates>
): ICommand<TArgs, TResult, TExtraStates> {
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
