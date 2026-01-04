export type Concurrency = "ignore" | "restart" | "queue" | "parallel";
declare const DEFAULT_STATES: {
    readonly load: "load";
    readonly failure: "failure";
    readonly ready: "ready";
};
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
type FlowFn<TArgs extends any[], TResult, TYield = unknown, TNext = unknown> = (...args: [...TArgs, AbortSignal?]) => Generator<TYield, TResult, TNext> | AsyncGenerator<TYield, TResult, TNext>;
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
export declare function asyncCommand<TArgs extends any[], TResult, TExtraStates extends CommandStatesMap = {}>(fn: AsyncFn<TArgs, TResult>, opt?: CommandOptions<TArgs, TExtraStates>): ICommand<TArgs, TResult, TExtraStates>;
export declare function flowCommand<TArgs extends any[], TResult, TYield = unknown, TNext = unknown, TExtraStates extends CommandStatesMap = {}>(fn: FlowFn<TArgs, TResult, TYield, TNext>, opt?: CommandOptions<TArgs, TExtraStates>): ICommand<TArgs, TResult, TExtraStates>;
export declare function commandAction<TThis, TArgs extends any[], TResult>(fn: (this: TThis, ...args: TArgs) => TResult): (this: TThis, ...args: TArgs) => TResult;
export {};
