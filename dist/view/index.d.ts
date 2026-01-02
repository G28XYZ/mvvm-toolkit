import type { DiServices, InjectType } from "../typedi";
import { TInstance } from "../utils";
import { ReactElement } from "react";
type ViewPropsByKey<K extends keyof DiServices, U> = U & {
    viewModel?: InjectType<K>;
};
type ViewPropsByClass<T extends TInstance, U> = U & {
    viewModel?: InstanceType<T>;
};
/**
 * Обертка над компонентом с инстансом ViewModel.
 */
export declare function view<K extends keyof DiServices, U = {}>(vm: K, reactComponent: (props: ViewPropsByKey<K, U>) => ReactElement): (props?: U & {
    viewModel?: InjectType<K>;
}) => ReactElement;
export declare function view<T extends TInstance, U = {}>(vm: T, reactComponent: (props: ViewPropsByClass<T, U>) => ReactElement): (props?: U & {
    viewModel?: InstanceType<T>;
}) => ReactElement;
export * from './types';
