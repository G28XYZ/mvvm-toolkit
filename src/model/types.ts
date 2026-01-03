import { Patch } from "immer";
import { Model } from ".";

export type ModelData<T> = Omit<T, keyof Model>;

export type DecoratorCallbackType<T, I> = (value: T, instance: I) => any;

type BivariantCallback<T> = {
  bivarianceHack(arg: T): void;
}["bivarianceHack"];

export interface IMetadataModel<T extends Record<string, any> = any> {
  name: string;
  callback?: T extends undefined ? DecoratorCallbackType<any, T> : T["callback"];
}

export type TPatch = Patch & { field?: string };

export type THistoryEntry = {
  patches: TPatch[];
  inversePatches: TPatch[];
};

export type ModelService<T> = {
  /** признак измененных данных в модели */
  dirty: boolean;
  /** массив хранит текущие значения в момент изменения */
  changes: TPatch[];
  /** массив хранит исходные значения в момент изменения */
  inverseChanges: TPatch[];
  /** история изменений для перемещения по состояниям */
  history: THistoryEntry[];
  /** текущая позиция в истории, -1 означает начальное состояние */
  historyIndex: number;
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
  /** откатиться на шаг назад */
  undo(): void;
  /** перейти на шаг вперед */
  redo(): void;
  /** перейти к конкретному шагу истории */
  goToHistory(index: number): void;
};

export type TModel<T> = T & {
  service: ModelService<T>;
};

export interface ModelOptions<T> {
  byFields?: (keyof T)[];
  devtools?: {
    name?: string;
    enabled?: boolean;
    instanceId?: string;
  };
}
