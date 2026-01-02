import type { Model } from ".";
type DevtoolsOptions = {
    name?: string;
    actionType?: string;
    instanceId?: string;
};
/**
 * Подключить модель к Redux DevTools Extension для просмотра и тайм-тревела.
 */
export declare const attachModelDevtools: <T>(model: Model<T>, options?: DevtoolsOptions) => () => void;
export {};
