import { makeAutoObservable } from "mobx";
import { asyncCommand, type CommandOptions, type ICommand } from "./index";

type CommandFn<TArgs extends unknown[] = [], TResult = void> =
  ((...args: TArgs) => Promise<TResult>) & {
    state       : ServiceState;
    states      : typeof SERVICE_STATES;
    isExecuting : boolean;
    activeCount : number;
    isCanceled  : boolean;
    isDisposed  : boolean;
    error       : unknown;
    result      : TResult;
    resetError ?: () => void;
    cancel     ?: () => void;
    dispose    ?: () => void;
    clearQueue ?: () => void;
  };

/**
 * обертка для методов класса.
 *
 * - Превращает методы в вызываемые команды.
 * - Собирает состояние на классе (state/isExecuting/error/...).
 */

type AnyCommandOptions = CommandOptions<unknown[], Record<string, string>, unknown>;
type AnyCommand = ICommand<unknown[], unknown, Record<string, string>>;

type CommandMethodsMap<T> = Partial<Record<keyof T & string, string | boolean>>;
/**
 * Итоговый словарь состояний, который видит потребитель класса.
 */
const SERVICE_STATES = {
  load    : "loading",
  save    : "saving",
  remove  : "removing",
  delete  : "deleting",
  failure : "failure",
  ready   : "ready",
  canceled: "canceled",
  disposed: "disposed",
} as const

type ServiceState = typeof SERVICE_STATES[keyof typeof SERVICE_STATES];

const DEFAULT_METHOD_KEYS = ["load", "save", "remove", "delete"] as const;

const STORE_STATE_KEY = Symbol("storeState");
const LAST_CMD_KEY = Symbol("lastCommand");

type CommandServiceMeta = {
  [STORE_STATE_KEY]?: true;
  [LAST_CMD_KEY]?: AnyCommand;
};

type CommandServiceType = {
  state       : string;
  states      : Record<string, string>;
  isExecuting : boolean;
  activeCount : number;
  isCanceled  : boolean;
  isDisposed  : boolean;
  error       : unknown;
  result      : unknown;
  resetError ?: () => void;
  cancel     ?: () => void;
  dispose    ?: () => void;
  clearQueue ?: () => void;
};

/**
 * Делает команду вызываемой как обычная функция,
 * но сохраняет доступ к состояниям команды через геттеры.
 */
function makeCommandCallable<TArgs extends unknown[], TResult>(
  cmd: ICommand<TArgs, TResult, Record<string, string>>
): CommandFn<TArgs, TResult> {
  const run = (...args: TArgs) => cmd.execute(...args);
  Object.defineProperties(run, {
    state      : { get: () => cmd.state },
    states     : { get: () => cmd.states },
    isExecuting: { get: () => cmd.isExecuting },
    activeCount: { get: () => cmd.activeCount },
    isCanceled : { get: () => cmd.isCanceled },
    isDisposed : { get: () => cmd.isDisposed },
    error      : { get: () => cmd.error },
    result     : { get: () => cmd.result },
    resetError : { get: () => cmd.resetError },
    cancel     : { get: () => cmd.cancel },
    dispose    : { get: () => cmd.dispose },
    clearQueue : { get: () => cmd.clearQueue },
  });
  return run as CommandFn<TArgs, TResult>;
}

/**
 * Инициализирует поля состояния на экземпляре класса.
 * Делается один раз на объект.
 */
function ensureStoreState(target: CommandServiceType & CommandServiceMeta): void {
  if (target[STORE_STATE_KEY]) return;
  Object.defineProperty(target, STORE_STATE_KEY, { value: true });
  Object.assign(target, {
    state      : SERVICE_STATES.ready,
    states     : { ...SERVICE_STATES },
    isExecuting: false,
    activeCount: 0,
    isCanceled : false,
    isDisposed : false,
    error      : null,
    result     : undefined,
    resetError: () => {
      target.error = null;
      const cmd = target[LAST_CMD_KEY];
      cmd?.resetError?.();
      syncFromCommand(target, cmd);
    },
    cancel: () => {
      const cmd = target[LAST_CMD_KEY];
      cmd?.cancel?.();
      syncFromCommand(target, cmd);
    },
    dispose: () => {
      const cmd = target[LAST_CMD_KEY];
      cmd?.dispose?.();
      syncFromCommand(target, cmd);
    },
    clearQueue: () => {
      const cmd = target[LAST_CMD_KEY];
      cmd?.clearQueue?.();
    },
  });
}

/**
 * Синхронизирует состояние класса с актуальным состоянием команды.
 * Последняя команда "побеждает" и определяет все поля.
 */
function syncFromCommand(target: CommandServiceType, cmd: AnyCommand | undefined): void {
  if (!cmd) return;
  for (const [key, value] of Object.entries(cmd.states ?? {})) {
    target.states[key] = value;
  }
  target.state       = cmd.state;
  target.isExecuting = cmd.isExecuting;
  target.activeCount = cmd.activeCount;
  target.isCanceled  = cmd.isCanceled;
  target.isDisposed  = cmd.isDisposed;
  target.error       = cmd.error;
  target.result      = cmd.result;
}

/**
 * Прописывает load-лейбл в states/stateKeys для команды.
 */
function withLoadLabel(
  label: string | undefined,
  opt?: AnyCommandOptions
): AnyCommandOptions | undefined {
  if (!label) return opt;
  return {
    ...opt,
    states   : { ...(opt?.states ?? {}), [label]: label },
    stateKeys: { ...(opt?.stateKeys ?? {}), load: label },
  };
}

/**
 * Оборачивает хуки asyncCommand, чтобы синхронизировать состояние класса.
 */
function withStoreHooks(
  target: CommandServiceType & CommandServiceMeta,
  loadLabel: string,
  getCmd?: () => AnyCommand | undefined,
  opt?: AnyCommandOptions
): AnyCommandOptions | undefined {
  ensureStoreState(target);
  return {
    ...opt,
    onStart: (...args: unknown[]) => {
      const cmd = getCmd?.();
      target[LAST_CMD_KEY] = cmd;
      target.state = loadLabel;
      target.isExecuting = true;
      target.isCanceled = false;
      if (opt?.resetErrorOnExecute ?? true) target.error = null;
      syncFromCommand(target, cmd);
      opt?.onStart?.(...args);
    },
    onSuccess: (result: unknown, ...args: unknown[]) => {
      syncFromCommand(target, getCmd?.());
      opt?.onSuccess?.(result, ...args);
    },
    onError: (e: unknown) => {
      syncFromCommand(target, getCmd?.());
      opt?.onError?.(e);
    },
    onCancel: () => {
      syncFromCommand(target, getCmd?.());
      opt?.onCancel?.();
    },
    onFinally: (info, ...args: unknown[]) => {
      syncFromCommand(target, getCmd?.());
      opt?.onFinally?.(info, ...args);
    },
  };
}

/**
 * Преобразует методы в команды и подмешивает состояние к экземпляру.
 */
export function applyCommandMethods<T extends CommandServiceType>(target: T, map?: CommandMethodsMap<T>): void {
  ensureStoreState(target);
  const effectiveMap: Record<string, string | boolean> = map ? { ...map } : {};
  if (!map) {
    for (const key of DEFAULT_METHOD_KEYS) {
      const value = (target as Record<string, unknown>)[key];
      if (typeof value === "function") {
        const label = SERVICE_STATES[key];
        if (label) effectiveMap[key] = label;
      }
    }
  }

  for (const [key, config] of Object.entries(effectiveMap)) {
    if (!config) continue;
    const original = (target as Record<string, unknown>)[key];
    if (typeof original !== "function") continue;
    if ('execute' in original && typeof original.execute === "function") continue;

    const loadLabel =
      typeof config === "string"
        ? config
        : Reflect.get(SERVICE_STATES, key);

    let cmd: AnyCommand | undefined;
    const hookedOptions = withStoreHooks(target, loadLabel ?? SERVICE_STATES.load, () => cmd);
    const commandOptions = withLoadLabel(loadLabel, hookedOptions);
    cmd = asyncCommand(
      async (...args: unknown[]) => original.apply(target, args),
      commandOptions
    );
    const callable = makeCommandCallable(cmd);

    if (loadLabel) target.states[loadLabel] = loadLabel;
    Object.defineProperty(target, key, { value: callable, configurable: true, writable: true });
  }
}

/**
 * Базовый класс для обертки методов в команды.
 * Применяет логику команд в конструкторе.
 */
export class CommandService implements CommandServiceType {
  state       : ServiceState = SERVICE_STATES.ready;
  states      : typeof SERVICE_STATES = { ...SERVICE_STATES };
  isExecuting : boolean = false;
  activeCount : number = 0;
  isCanceled  : boolean = false;
  isDisposed  : boolean = false;
  error       : unknown = null;
  result      : unknown = undefined;
  resetError ?: () => void;
  cancel     ?: () => void;
  dispose    ?: () => void;
  clearQueue ?: () => void;

  constructor() {
    applyCommandMethods(this);
  }
}
