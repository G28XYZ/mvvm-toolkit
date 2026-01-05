export type Concurrency = "ignore" | "restart" | "queue" | "parallel";
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
export type DefaultCommandStates = typeof DEFAULT_STATES;
export type CommandStatesMap = Record<string, string>;
export type CommandStates<TExtra extends CommandStatesMap = {}> = Omit<DefaultCommandStates, keyof TExtra> & TExtra;
export type CommandStateValue<TStates extends CommandStatesMap> = TStates[keyof TStates & string];
export type CommandStateKeys<TStates extends CommandStatesMap = CommandStates> = {
    load?: keyof TStates & string;
    failure?: keyof TStates & string;
    ready?: keyof TStates & string;
    canceled?: keyof TStates & string;
    disposed?: keyof TStates & string;
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
export interface CommandOptions<TArgs extends any[], TExtraStates extends CommandStatesMap = {}, TResult = void> {
    canExecute?: (scope: CommandScope<CommandStates<TExtraStates>>) => boolean;
    onError?: (e: unknown) => void;
    onCancel?: () => void;
    onStart?: (...args: TArgs) => void;
    onSuccess?: (result: TResult, ...args: TArgs) => void;
    onFinally?: (info: {
        ok: boolean;
        canceled: boolean;
        error: unknown;
    }, ...args: TArgs) => void;
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
export declare function asyncCommand<F extends (...args: any[]) => Promise<any>, TExtraStates extends CommandStatesMap = {}>(fn: F, opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>> & {
    swallowError: false;
}): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;
export declare function asyncCommand<F extends (...args: any[]) => Promise<any>, TExtraStates extends CommandStatesMap = {}>(fn: F, opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, PromiseResult<F>>): ICommand<StripAbortSignal<Parameters<F>>, PromiseResult<F> | undefined, TExtraStates>;
export declare function flowCommand<F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>), TExtraStates extends CommandStatesMap = {}>(fn: F, opt: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>> & {
    swallowError: false;
}): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;
export declare function flowCommand<F extends (...args: any[]) => (Generator<any, any, any> | AsyncGenerator<any, any, any>), TExtraStates extends CommandStatesMap = {}>(fn: F, opt?: CommandOptions<StripAbortSignal<Parameters<F>>, TExtraStates, GeneratorResult<F>>): ICommand<StripAbortSignal<Parameters<F>>, GeneratorResult<F> | undefined, TExtraStates>;
export declare function commandAction<TThis, TArgs extends any[], TResult>(fn: (this: TThis, ...args: TArgs) => TResult): (this: TThis, ...args: TArgs) => TResult;
export {};
