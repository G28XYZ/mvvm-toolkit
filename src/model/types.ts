import { Model } from ".";

export type ModelData<T> = Omit<T, keyof Model>;

export type DecoratorCallbackType<T, I> = (value: T, instance: I) => any;

type BivariantCallback<T> = {
  bivarianceHack(arg: T): void;
}["bivarianceHack"];

export interface IMetadataModel<T extends Record<string, any> = any> {
  name: string;
  callback?: T extends undefined ? DecoratorCallbackType<any, T> : T["callback"];
  isInit: boolean;
}

export type ModelService<T> = {
  /** признак измененных данных в модели */
  dirty: boolean;
  /** дамп сериализованных данных (для отправки на сервер сервера) */
  dumpData: Partial<T>;
  /** */
  validation: Partial<Record<keyof T, ReturnType<IMetadataModel["callback"]>>>;

  /** загрузить/обновить данные */
  loadData(data?: Partial<T>): Model<T>;
  /** сбросить значения до крайнего коммита, сбросить флаг dirty */
  reject(): void;
  /** зафиксировать все значения полей модели, сбросить флаг dirty */
  commit(): void;
  /** зафиксировать значение поля модели */
  commitField: BivariantCallback<keyof T>;
  /** сбросить все значения полей модели к исходным */
  toInit(): Model<T>;
};

export type TModel<T> = T & {
  service: ModelService<T>;
};

export interface ModelOptions<T> {
  byFields?: (keyof T)[];
}
