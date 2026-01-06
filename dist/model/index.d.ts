import { immerable } from "immer";
import { IFieldMetadata } from "./data";
import { ModelOptions, ModelService, TModel, TPatch, THistoryEntry } from "./types";
/**
 * Класс для управлением состоянием модели.
 */
export declare class Model<T = any> implements TModel<any> {
    protected accessor [immerable]: boolean;
    protected accessor initData: Partial<T>;
    protected accessor committedData: Partial<T>;
    private accessor modified_;
    private accessor draft;
    protected accessor changes: TPatch[];
    protected accessor inverseChanges: TPatch[];
    protected accessor history: THistoryEntry[];
    protected accessor historyIndex: number;
    private accessor legacyInitDone;
    private accessor options;
    private accessor historyMuted;
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(data?: Partial<T>, options?: ModelOptions<T>);
    /**
     * Сбросить внутренние стейты изменений.
     */
    /**
     * Инициализировать валидацию для поля или всех полей.
     */
    private initValidation;
    /**
     * Полная инициализация модели и полей.
     */
    protected init(data?: Partial<T>): void;
    /**
     * Инициализировать отдельное поле модели.
     */
    protected initField(field: string, options?: {
        skipValidation?: boolean;
    }): void;
    private initLegacyFields;
    /**
     * Создать draft для отслеживания изменений.
     */
    private createDraft;
    private autoAttachDevtools;
    private withHistoryMuted;
    private syncChangesFromHistory;
    private applyHistoryPatches;
    /**
     * зафиксировать изменение значения
     * @param changePath
     * @param newValue
     * @param endField
     * @returns
     */
    /**
     * Зафиксировать изменение в draft и собрать патчи.
     */
    private produceDraft;
    /**
     * сделать значение наблюдаемым, повесить observable в глубину
     * @param value
     * @param field
     * @param originField
     * @param changePath
     * @returns
     */
    /**
     * Сделать значение наблюдаемым с отслеживанием вложенных изменений.
     */
    private createObservable;
    /**
     * Определить getter/setter для поля модели.
     */
    protected defineFieldValue(field: string, value?: any, fieldInstance?: IFieldMetadata<any, any>): any;
    /**
     * Сохранить исходные данные с глубоким клонированием.
     */
    private cloneForInit;
    /**
     * Проверить изменение поля и обновить modified_.
     */
    private checkChange;
    /**
     * Применить данные к полям модели.
     */
    private defineData;
    /**
     * Признак наличия изменений.
     */
    protected get dirty(): boolean;
    /**
     * Зафиксировать все изменения.
     */
    protected commit(): void;
    /**
     * Зафиксировать изменения конкретного поля.
     */
    protected commitField<K extends keyof T | string>(field: K): void;
    /**
     * Откатить изменения к последнему коммиту.
     */
    protected reject(): void;
    /**
     * Вернуть модель к исходным данным.
     */
    protected toInit(): Model<T>;
    /**
     * Откатить изменения на один шаг истории.
     */
    protected undo(): void;
    /**
     * Повторить ранее откатанные изменения.
     */
    protected redo(): void;
    /**
     * Перейти к конкретному шагу истории.
     */
    protected goToHistory(index: number): void;
    /**
     * Перезагрузить данные модели.
     */
    protected loadData(data?: Partial<T>): Model<T>;
    /**
     * Получить сериализованный дамп данных.
     */
    protected get dumpData(): T;
    /**
     * Получить объект результатов валидации.
     */
    protected get validation(): Partial<T>;
    /**
     * Признак валидности и наличия изменений.
     */
    protected get validAndDirty(): boolean;
    /**
     * Публичный API модели для вью.
     */
    private get serviceApi();
    get service(): ModelService<T>;
}
export * from './types';
export * from './devtools';
