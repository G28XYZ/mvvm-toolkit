import { ReactElement, ReactNode } from "react";
import type { DiServices, InjectType } from "../typedi";
import { TInstance } from "../utils";
type ViewPropsByKey<K extends keyof DiServices> = {
    viewModel: K | InjectType<K>;
    children: ReactNode | ((vm: InjectType<K> | undefined) => ReactNode);
} & Record<string, any>;
type ViewPropsByClass<T extends TInstance> = {
    viewModel: T | InstanceType<T>;
    children: ReactNode | ((vm: InstanceType<T> | undefined) => ReactNode);
} & Record<string, any>;
export declare function View<K extends keyof DiServices>(props: ViewPropsByKey<K>): ReactElement;
export declare function View<T extends TInstance>(props: ViewPropsByClass<T>): ReactElement;
export {};
