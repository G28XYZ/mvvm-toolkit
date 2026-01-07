import { isObject, isEqual, isEmpty } from "lodash";
import { immerable, produce, createDraft, Draft, enablePatches, applyPatches } from "immer";
import { action, computed, isObservable, observable, runInAction } from "mobx";
import { FieldMetadata, SubmitMetadata, ValidationMetadata, ExcludeMetadata, IFieldMetadata } from "./data";
import { attachModelDevtools } from "./devtools";
import { ModelOptions, ModelService, TModel, TPatch, THistoryEntry } from "./types";
enablePatches();
/** */
const submitMetadata = new SubmitMetadata();
/** */
const fieldMetadata = new FieldMetadata();
/** */
const validationMetadata = new ValidationMetadata();
/** */
const excludeMetadata = new ExcludeMetadata();

/**
 * Класс для управлением состоянием модели.
 */
export class Model<T extends Record<string, any> = any > implements TModel<any> {
  // @define_prop
  protected accessor [immerable] = true;

  @observable
  // @define_prop
  protected accessor initData: Partial<T> = null;

  // @define_prop
  protected accessor committedData: Partial<T> = {};

  // @define_prop
  private accessor modified_: Partial<T> = {};

  // @define_prop
  private accessor draft: Draft<T | Partial<T>> = null;

  // @define_prop
  protected accessor changes: TPatch[] = [];

  // @define_prop
  protected accessor inverseChanges: TPatch[] = [];

  // @define_prop
  protected accessor history: THistoryEntry[] = [];

  // @define_prop
  protected accessor historyIndex: number = -1;

  // @define_prop
  private accessor legacyInitDone = false;

  // @define_prop
  private accessor options: ModelOptions<T> = {};

  // @define_prop
  private accessor historyMuted = false;

  /**
   * Создает модель и инициализирует данные.
   */
  constructor(data: Partial<T> = {}, options?: ModelOptions<T> ) {
    this.options = options;
    this[immerable] = true;
    this.init(data);
    this.initLegacyFields();
    this.autoAttachDevtools();
  }

  /**
   * Сбросить внутренние стейты изменений.
   */
  // @action private resetToDefault() {
  //   this.modified_ = {};
  //   this.committedData = {};
  //   this.changes = [];
  //   this.inverseChanges = [];
  //   this.history = [];
  //   this.historyIndex = -1;
  // }

  /**
   * Инициализировать валидацию для поля или всех полей.
   */
  private initValidation(field?: string) {
    if (field) Reflect.get(this.validation, field);
    else for (let validation in this.validation) this.validation[validation];
  }

  /**
   * Полная инициализация модели и полей.
   */
  protected init(data: Partial<T> = {}) {
    this.cloneForInit(data);
    // this.resetToDefault();
    this.createDraft(data);
    this.defineData(this.initData);
  }

  /**
   * Инициализировать отдельное поле модели.
   */
  protected initField(field: string, options?: { skipValidation?: boolean }) {
    const fieldInstance = fieldMetadata.fieldInstance(field, this);
    if (fieldInstance) {
      if(field in this.initData === false) Reflect.set(this.initData, field, Reflect.get(this, field));
      const value = fieldInstance?.factory ? fieldInstance.factory(this.initData, this) : this.initData[fieldInstance.name];
      this.defineFieldValue(field, value, fieldInstance);
      if (!options?.skipValidation) this.initValidation(field);
    }
  }

  private initLegacyFields() {
    if (this.legacyInitDone) return;
    const fields = fieldMetadata.fields(this);
    if (!fields.some((field) => Object.prototype.hasOwnProperty.call(this, field.name))) return;
    this.legacyInitDone = true;
    for (let field of fields) {
      if (this.initData && String(field.name) in this.initData || !fieldMetadata.fieldInstance(String(field.name), this)) continue;
      this.initField(String(field.name), { skipValidation: true });
    }
  }

  /**
   * Создать draft для отслеживания изменений.
   */
  private createDraft(data?: Partial<T>) {
    // const draft: Partial<T> = {};

    // TODO - поправить, тут несколько раз проходит по списку вместо одного
    // for(let field in data) {
    //   const fieldInstance = fieldMetadata.fieldInstance(field, this);
    //   if(fieldInstance) draft[field] = data[field];
    // }

    this.draft = createDraft(data);
  }

  private autoAttachDevtools() {
    const globalAny = globalThis as unknown as {
      __MVVM_DEVTOOLS_AUTO__?: boolean;
      __MVVM_DEVTOOLS_SEQ__?: number;
    };
    if (!globalAny.__MVVM_DEVTOOLS_AUTO__) return;
    if (this.options?.devtools?.enabled === false) return;

    const name = this.options?.devtools?.name ?? this.constructor?.name ?? "Model";
    const seq = (globalAny.__MVVM_DEVTOOLS_SEQ__ ?? 0) + 1;
    globalAny.__MVVM_DEVTOOLS_SEQ__ = seq;
    attachModelDevtools(this, { name, instanceId: this.options?.devtools?.instanceId ?? `${name}#${seq}` });
  }

  private withHistoryMuted(action: () => void) {
    this.historyMuted = true;
    try {
      action();
    } finally {
      this.historyMuted = false;
    }
  }

  // @define_prop
  // private readonly serviceToJSON = () => this.dumpData;

  private syncChangesFromHistory() {
    const activeHistory = this.historyIndex >= 0 ? this.history.slice(0, this.historyIndex + 1) : [];
    this.changes = activeHistory.flatMap((item) => item.patches);
    this.inverseChanges = activeHistory.flatMap((item) => item.inversePatches);
  }

  private applyHistoryPatches(patches: TPatch[]) {
    if (!patches.length) return;

    applyPatches(this.draft, patches);

    const fields = new Set(patches.map((item) => item.field).filter(Boolean));
    if (fields.size === 0) return;

    this.withHistoryMuted(() => {
      for (let field of fields) {
        const draftValue = Reflect.get(this.draft as object, field) ?? Reflect.get(this.initData, field);
        Reflect.set(this, field, draftValue);
        this.defineFieldValue(field, Reflect.get(this, field));
      }
    });
  }
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
  @action
  private produceDraft(changePath: string, newValue: any, endField?: string) {
    if (this.historyMuted) return;

    let originField: string;
    let latestPatches: TPatch[] = [];
    if (changePath) {
      originField = changePath.split(".")[0];
      if (originField && !fieldMetadata.fieldInstance(originField, this).collectChanges) return;
    }

    produce(
      this.draft,
      (draft) => {
        if (changePath) {
          let current: Record<string, any> = draft;
          const paths = changePath.split(".");

          if (paths.length > 1) {
            for (let i = 0; i < paths.length; i++) {

              if (!(i == paths.length - 1) && !isObject(current)) {
                break;
              }

              isObject(current) && (current = current[paths[i]]);
            }
          } else {
            endField = changePath;
          }

          current && (current[endField] = newValue);
        }
      },
      (patches, inversePatches) => {
        if (originField) {
          patches = patches.map((item) => ({ ...item, field: originField }));
          inversePatches = inversePatches.map((item) => ({ ...item, field: originField }));
        }
        latestPatches = patches;
        if (!patches.length && !inversePatches.length) return;

        if (this.historyIndex < this.history.length - 1) {
          this.history = this.history.slice(0, this.historyIndex + 1);
          this.syncChangesFromHistory();
        }

        this.changes.push(...patches);
        this.inverseChanges.push(...inversePatches);
        this.history.push({ patches, inversePatches });
        this.historyIndex = this.history.length - 1;
      }
    );
    if (latestPatches.length) {
      applyPatches(this.draft, latestPatches);
    }
  }
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
  private createObservable(
    value: Record<string, any>,
    field: string,
    originField: string,
    changePath = originField
  ): Record<string, any> {

    value = isObservable(value) ? value : observable.box(value);

    return new Proxy(value, {
      get: (target, p, receiver) => {
        // value = observable.box(Reflect.get(target, p, receiver));

        const curValue = Reflect.get(target, p, receiver);

        const isObj = curValue && typeof curValue === "object" && !(curValue instanceof Model);

        if (isObj && !isObservable(value)) return this.createObservable(curValue, String(p), field, `${changePath}.${String(p)}`);

        return curValue;
      },
      set: (target, p, newValue, receiver) => {
        // if(this.checkChange(originField, Reflect.get(this, originField))) return true;

        value = newValue;

        this.produceDraft(changePath, value, String(p));

        this.checkChange(originField, Reflect.get(this, originField));

        return Reflect.set(target, p, newValue, receiver);
      },
    });
  }

  /**
   * Определить getter/setter для поля модели.
   */
  protected defineFieldValue(
    field: string,
    value?: any,
    fieldInstance: IFieldMetadata<any, any> = fieldMetadata.fieldInstance(field, this)
  ) {

    if (value && typeof value === "object") {
      // TODO - может убрать...
      // value = this.createObservable(value, field, field);
    }

    if(fieldInstance.noObserve) {
      Reflect.defineProperty(this, fieldInstance.name, { value })
    } else {

      value = observable.box(value);

      Reflect.defineProperty(this, fieldInstance.name, {
        get: () => value.get(),
        set: (v) => {
          runInAction(() => value.set(v));
          this.produceDraft(fieldInstance.name, value.get());
          this.checkChange(fieldInstance.name, value.get());
        },
        enumerable: true,
        configurable: true,
      });

    }


    return value;
  }

  /**
   * Сохранить исходные данные с глубоким клонированием.
   */
  private cloneForInit(data: Partial<T> = {}) {
    // TODO - clone ?
    this.initData = data;
  }

  /**
   * Проверить изменение поля и обновить modified_.
   */
  private checkChange(field: string | keyof T, value: any) {
    const originValue = (Reflect.get(this.committedData, field)) || (Reflect.get(this.initData, field));
    const isChanged = field && field in this.initData && !isEqual(originValue, value);

    runInAction(() => {
      if (isChanged) {
        Reflect.set(this.modified_, field, originValue);
      }
      for (const modified in this.modified_) {
        if (field === modified && field in this.modified_ && isEqual(originValue, value)) {
          delete this.modified_[modified];
        }
      }
    });

    return isChanged;
  }

  /**
   * Применить данные к полям модели.
   */
  private defineData(data: Partial<T>) {
    for (let field in this) {
      if (!Object.prototype.hasOwnProperty.call(this, field)) continue;
      if (fieldMetadata.fieldInstance(field, this)) {
        Reflect.set(this, field, Reflect.get(data, field));
        this.initField(field);
      }
    }
  }

  /**
   * Признак наличия изменений.
   */
  @computed protected get dirty() {
    return !isEmpty(this.modified_);
  }

  /**
   * Зафиксировать все изменения.
   */
  @action protected commit() {
    for (let field of fieldMetadata.fields(this)) this.commitField(field.name);

    this.modified_ = {};
  }

  /**
   * Зафиксировать изменения конкретного поля.
   */
  @action protected commitField<K extends keyof T | string>(field: K) {
    for (let field in this) {
      if (field in this.modified_) {
        Reflect.set(this.committedData, field, this[field])
      }
    }
    delete this.modified_[field as keyof T];

    this.modified_ = { ...this.modified_ };
  }

  /**
   * Откатить изменения к последнему коммиту.
   */
  @action protected reject() {
    for (let field in this) {
      if (field in this.modified_) {
        this[field] = Reflect.get(this.modified_ as object, field);
        this.commitField(field);
        this.defineFieldValue(field, this[field]);
      }
    }
    this.commit();
  }

  /**
   * Вернуть модель к исходным данным.
   */
  @action protected toInit(): Model<T> {
    this.withHistoryMuted(() => {
      for (let field in this) {
        if (field in this.initData) {
          this[field] = Reflect.get(this.initData as object, field);
          this.initField(field);
        }
      }
      this.init(this.initData);
    });
    return this;
  }

  /**
   * Откатить изменения на один шаг истории.
   */
  @action protected undo() {
    if (this.historyIndex < 0) return;

    this.applyHistoryPatches(this.history[this.historyIndex].inversePatches);
    this.historyIndex -= 1;
    this.syncChangesFromHistory();
  }

  /**
   * Повторить ранее откатанные изменения.
   */
  @action protected redo() {
    if (this.historyIndex >= this.history.length - 1) return;

    this.historyIndex = this.historyIndex + 1;
    this.applyHistoryPatches(this.history[this.historyIndex].patches);
    this.syncChangesFromHistory();
  }

  /**
   * Перейти к конкретному шагу истории.
   */
  @action protected goToHistory(index: number) {
    if (index < -1 || index >= this.history.length) return;
    if (index === this.historyIndex) return;

    while (this.historyIndex < index) {
      this.historyIndex = this.historyIndex + 1;
      this.applyHistoryPatches(this.history[this.historyIndex].patches);
    }

    while (this.historyIndex > index) {
      this.applyHistoryPatches(this.history[this.historyIndex].inversePatches);
      this.historyIndex -= 1;
    }

    this.syncChangesFromHistory();
  }

  /**
   * Перезагрузить данные модели.
   */
  protected loadData(data?: Partial<T>): Model<T> {
    this.withHistoryMuted(() => {
      this.init(data);
      this.defineData(this.initData);
    });
    return this;
  }

  /**
   * Получить сериализованный дамп данных.
   */
  protected get dumpData(): T {
    this.initLegacyFields();
    const result: T = Object.create({});

    const getValue = (field: string) => {
      try {
        return submitMetadata.fieldInstance(field, this).callback(Reflect.get(this, field), this)
      } catch {
        return Reflect.get(this, field)
      }
    };

    const isExcludeField = (field: string) => {
      const excludeInstance = excludeMetadata.fieldInstance(field, this);
      if (excludeInstance) {
        switch (typeof excludeInstance.callback) {
          case "boolean":  return Boolean(excludeInstance.callback);
          case "function": return excludeInstance.callback(Reflect.get(this, field), this);
        }
      }

      return false;
    };

    fieldMetadata.fields(this).forEach((item) => {
      if (item.name in this) {
        // если в опциях при создании модели передали определенные поля на базе сконфигурированной модели
        // исключить поля которых нет в массиве
        if(this.options?.byFields && !this.options.byFields.includes(item.name as keyof T)) return;

        if (isExcludeField(item.name)) return;
        return Reflect.set(result as object, item.name, getValue(item.name));
      }
    });

    return result;
  }

  /**
   * Получить объект результатов валидации.
   */
  @computed protected get validation() {
    this.initLegacyFields();
    const validation: Partial<T> = {};

    for (const field in this) {
      const instance = validationMetadata.fieldInstance(field, this);
      if (instance) Reflect.set(validation, field, instance.callback(this[field], this) || "");
    }

    return validation;
  }

  /**
   * Признак валидности и наличия изменений.
   */
  @computed protected get validAndDirty() {
    return this.dirty && Object.values(this.validation).filter(Boolean).length === 0;
  }

  /**
   * Публичный API модели для вью.
   */
  private get serviceApi(): Pick<
    ModelService<T>,
    "loadData" | "reject" | "commit" | "commitField" | "toInit" | "undo" | "redo" | "goToHistory"
  > {
    return {
      loadData   : (data?: Partial<T>): Model<T> => this.loadData(data),
      reject     : (): void => this.reject(),
      commit     : (): void => this.commit(),
      commitField: (field: keyof T): void => this.commitField(field),
      toInit     : (): Model<T> => this.toInit(),
      undo       : (): void => this.undo(),
      redo       : (): void => this.redo(),
      goToHistory: (index: number): void => this.goToHistory(index),
    }
  };

  @computed.struct public get service(): ModelService<T> {
    return {
        dirty         : this.dirty,
        dumpData      : this.dumpData,
        // toJSON        : this.serviceToJSON,
        validation    : this.validation,
        changes       : this.changes,
        inverseChanges: this.inverseChanges,
        history       : this.history,
        historyIndex  : this.historyIndex,
        ...this.serviceApi,
    };
  }
}

export * from './types';
export * from './devtools';
