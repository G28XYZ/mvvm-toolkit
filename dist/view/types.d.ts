import { FC } from "react";
import type { DiServices, InjectType } from "../typedi";
type ViewServiceKey = keyof DiServices & string;
type ViewServiceKeyHint = ViewServiceKey | (string & {});
type ViewModelArg = ViewServiceKeyHint | object;
type ResolveViewModel<T extends ViewModelArg> = T extends ViewServiceKey ? InjectType<T> : T;
export type ViewType<T extends ViewModelArg = ViewServiceKeyHint> = {
    viewModel?: ResolveViewModel<T>;
};
export type ViewFC<T extends ViewModelArg = ViewServiceKeyHint, P extends Record<string, any> = null> = P extends null ? FC<ViewType<T>> : FC<ViewType<T> & P>;
export type ViewProps<T extends ViewModelArg = ViewServiceKeyHint, P extends Record<string, any> = {}> = ViewType<T> & P;
/**
 * Базовый класс ViewModel с методами жизненного цикла.
 */
export declare class ViewModel {
    /**
     * Вызывается при маунте компонента.
     */
    onInit?(): void | Promise<void>;
    /**
     * Вызывается при размонтировании компонента.
     */
    onDispose?(): void | Promise<void>;
}
export {};
