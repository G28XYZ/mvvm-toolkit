import { cloneDeep, isObject, isEqual, isEmpty } from "lodash";
import { immerable, produce, createDraft, Draft, enablePatches, applyPatches } from "immer";
import { action, computed, isObservable, observable, runInAction } from "mobx";
import { FieldMetadata, SubmitMetadata, ValidationMetadata, ExcludeMetadata } from "./data";
import { define_prop } from "../decorators/define_prop";
import { attachModelDevtools } from "./devtools";
import { ModelOptions, TModel, TPatch, THistoryEntry } from "./types";
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
export class Model<T = any > implements TModel<any> {
  @define_prop
  protected [immerable] = true;

  @observable
  @define_prop
  protected accessor initData: Partial<T> = null;

  @observable
  @define_prop
  protected accessor committedData: Partial<T> = {};

  @observable
  @define_prop
  private accessor modified_: Partial<T> = {};

  @define_prop
  private draft: Draft<T | Partial<T>> = null;

  @observable
  @define_prop
  protected accessor changes: TPatch[] = [];

  @observable
  @define_prop
  protected accessor inverseChanges: TPatch[] = [];

  @observable
  @define_prop
  protected accessor history: THistoryEntry[] = [];

  @observable
  @define_prop
  protected accessor historyIndex: number = -1;

  @define_prop
  private initializedFields?: Set<string>;

  @define_prop
  private legacyInitDone = false;

  @define_prop
  private rawInitData: Partial<T> = null;

  @define_prop
  private options?: ModelOptions<T>;

  /**
   * Создает модель и инициализирует данные.
   */
  constructor(data: Partial<T> = {}, options?: ModelOptions<T> ) {
    this.options = options;
    this[immerable] = true;
    this.init(data);
    this.autoAttachDevtools();
    this.initLegacyFields();
  }

  /**
   * Сбросить внутренние стейты изменений.
   */
  @action private resetToDefault() {
    this.modified_ = {};
    this.committedData = {};
    this.changes = [];
    this.inverseChanges = [];
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Инициализировать валидацию для поля или всех полей.
   */
  private initValidation(field?: string) {
    if (field) Reflect.get(this.validation, field);
    else for (const validation in this.validation) this.validation[validation];
  }

  /**
   * Полная инициализация модели и полей.
   */
  protected init(data: Partial<T> = {}) {
    this.cloneForInit(data);
    this.resetToDefault();
    this.createDraft(data);
    this.defineData(this.initData);
  }

  /**
   * Инициализировать отдельное поле модели.
   */
  protected initField(field: string, options?: { skipValidation?: boolean }) {
    const fieldInstance = fieldMetadata.fieldInstance(field, this);
    if (fieldInstance) {
      if(field in this.initData === false) Reflect.set(this.initData, field, cloneDeep(Reflect.get(this, field)));
      const data = cloneDeep(this.initData);
      const value = fieldInstance?.factory ? fieldInstance.factory(data, this) : Reflect.get(data, fieldInstance.name);
      this.defineFieldValue(field, value);
      if (!options?.skipValidation) this.initValidation(field);
      this.getInitializedFields().add(String(field));
    }
  }

  private getInitializedFields() {
    if (!this.initializedFields) this.initializedFields = new Set<string>();
    return this.initializedFields;
  }

  private initLegacyFields() {
    if (this.legacyInitDone) return;
    const fields = fieldMetadata.fields(this);
    const hasOwnFields = fields.some((field) => Object.prototype.hasOwnProperty.call(this, field.name));
    if (!hasOwnFields) return;
    this.legacyInitDone = true;
    const initialized = this.getInitializedFields();
    const sourceInit = this.rawInitData ?? this.initData;
    if (sourceInit && sourceInit !== this.initData) {
      try {
        this.initData = cloneDeep(sourceInit);
      } catch {
        this.initData = { ...sourceInit };
      }
    }
    for (const field of fields) {
      const name = String(field.name);
      const hasInit = sourceInit && name in sourceInit;
      if (hasInit) {
        const fieldInstance = fieldMetadata.fieldInstance(name, this);
        if (!fieldInstance) continue;
        const data = cloneDeep(sourceInit);
        const nextValue = fieldInstance.factory ? fieldInstance.factory(data, this) : Reflect.get(data, fieldInstance.name);
        const currentValue = Reflect.get(this, name);
        if (!isEqual(currentValue, nextValue) || !initialized.has(name)) {
          this.defineFieldValue(name, nextValue);
          Reflect.set(this, name, nextValue);
        }
        initialized.add(name);
        continue;
      }
      if (initialized.has(name)) continue;
      this.initField(name, { skipValidation: true });
    }
  }

  /**
   * Создать draft для отслеживания изменений.
   */
  private createDraft(data?: Partial<T>) {
    const draft: Partial<T> = {};

    for(const field in data) {
      const fieldInstance = fieldMetadata.fieldInstance(field, this);
      if(fieldInstance) Reflect.set(draft, field, cloneDeep(data[field]));
    }

    this.draft = createDraft(draft);
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
    const instanceId = this.options?.devtools?.instanceId ?? `${name}#${seq}`;
    const schedule = globalThis.queueMicrotask ?? ((cb: () => void) => Promise.resolve().then(cb));
    schedule(() => attachModelDevtools(this, { name, instanceId }));
  }

  private withHistoryMuted(action: () => void) {
    this.historyMuted = true;
    try {
      action();
    } finally {
      this.historyMuted = false;
    }
  }

  @define_prop
  private historyMuted = false;

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
      for (const field of fields) {
        const draftRecord = this.draft as unknown as Record<string, unknown>;
        const initRecord = this.initData as unknown as Record<string, unknown>;
        const hasDraftField = Reflect.has(draftRecord, field);
        const draftValue = hasDraftField ? Reflect.get(draftRecord, field) : Reflect.get(initRecord, field);
        let nextValue = draftValue;
        try {
          nextValue = cloneDeep(draftValue);
        } catch {
          nextValue = draftValue;
        }
        Reflect.set(this, field, nextValue);
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
              const isLastItem = i == paths.length - 1;

              if (!isLastItem && !isObject(current)) {
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

    return new Proxy(value.get(), {
      get: (target, p, receiver) => {
        // value = observable.box(Reflect.get(target, p, receiver));

        const curValue = Reflect.get(target, p, receiver);

        const isObj = curValue && typeof curValue === "object" && !(curValue instanceof Model);

        if (isObj && !isObservable(value)) return this.createObservable(curValue, String(p), field, `${changePath}.${String(p)}`);

        return curValue;
      },
      set: (target, p, newValue, receiver) => {
        // if(this.checkChange(originField, Reflect.get(this, originField))) return true;

        const result = Reflect.set(target, p, newValue, receiver);
        value.set(newValue);

        this.produceDraft(changePath, value.get(), String(p));

        this.checkChange(originField, Reflect.get(this, originField));

        return result;
      },
    });
  }

  /**
   * Определить getter/setter для поля модели.
   */
  protected defineFieldValue(field: string, value?: any) {
    const fieldInstance = fieldMetadata.fieldInstance(field, this);

    if (value && typeof value === "object") {
      value = this.createObservable(value, field, field);
    }

    value = observable.box(value);

    Reflect.defineProperty(this, fieldInstance.name, {
      get() {
        return value.get();
      },
      set: (v) => {
        runInAction(() => value.set(v));
        this.produceDraft(fieldInstance.name, value.get());
        this.checkChange(fieldInstance.name, value.get());
      },
      enumerable: true,
      configurable: true,
    });

    return value;
  }

  /**
   * Сохранить исходные данные с глубоким клонированием.
   */
  private cloneForInit(data: Partial<T>) {
    if (data) {
      try {
        const cloned = cloneDeep(data);
        this.initData = cloned;
        this.rawInitData = cloned;
      } catch {
        const cloned = { ...data };
        this.initData = cloned;
        this.rawInitData = cloned;
      }
    } else {
      this.rawInitData = null;
    }
  }

  /**
   * Проверить изменение поля и обновить modified_.
   */
  private checkChange(field: string | keyof T, value: any) {
    const currentValue = cloneDeep(value);
    const originValue = cloneDeep(Reflect.get(this.committedData, field)) || cloneDeep(Reflect.get(this.initData, field));
    const isChanged = field && field in this.initData && !isEqual(originValue, currentValue);

    runInAction(() => {
      if (isChanged) {
        Reflect.set(this.modified_, field, cloneDeep(originValue) || originValue);
      }
      for (const modified in this.modified_) {
        if (field === modified && field in this.modified_ && isEqual(originValue, currentValue)) {
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
    for (const field in this) {
      if (!Object.prototype.hasOwnProperty.call(this, field)) continue;
      const instance = fieldMetadata.fieldInstance(field, this);
      if (instance) {
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
    for (const field of fieldMetadata.fields(this)) {
      this.commitField(field.name as keyof T);
    }

    this.modified_ = {};
  }

  /**
   * Зафиксировать изменения конкретного поля.
   */
  @action protected commitField<K extends keyof T>(field: K) {
    for (const field in this) {
      if (field in this.modified_) {
        Reflect.set(this.committedData, field, this[field])
      }
    }
    delete this.modified_[field];

    this.modified_ = { ...this.modified_ };
  }

  /**
   * Откатить изменения к последнему коммиту.
   */
  @action protected reject() {
    for (const field in this) {
      if (field in this.modified_) {
        this[field] = Reflect.get(this.modified_ as object, field);
        this.commitField(field as unknown as keyof T);
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
      for (const field in this) {
        if (field in this.initData) {
          const value: any = Reflect.get(this.initData, field);
          this[field] = value;
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

    const entry = this.history[this.historyIndex];
    this.historyIndex -= 1;
    this.applyHistoryPatches(entry.inversePatches);
    this.syncChangesFromHistory();
  }

  /**
   * Повторить ранее откатанные изменения.
   */
  @action protected redo() {
    if (this.historyIndex >= this.history.length - 1) return;

    const nextIndex = this.historyIndex + 1;
    const entry = this.history[nextIndex];
    this.historyIndex = nextIndex;
    this.applyHistoryPatches(entry.patches);
    this.syncChangesFromHistory();
  }

  /**
   * Перейти к конкретному шагу истории.
   */
  @action protected goToHistory(index: number) {
    if (index < -1 || index >= this.history.length) return;
    if (index === this.historyIndex) return;

    while (this.historyIndex < index) {
      const nextIndex = this.historyIndex + 1;
      const entry = this.history[nextIndex];
      this.historyIndex = nextIndex;
      this.applyHistoryPatches(entry.patches);
    }

    while (this.historyIndex > index) {
      const entry = this.history[this.historyIndex];
      this.historyIndex -= 1;
      this.applyHistoryPatches(entry.inversePatches);
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
      const instance = submitMetadata.fieldInstance(field, this);
      if (instance?.callback) return instance.callback(Reflect.get(this, field), this);
      else return Reflect.get(this, field);
    };

    const isExcludeField = (field: string) => {
      const excludeInstance = excludeMetadata.fieldInstance(field, this);
      if (excludeInstance) {
        switch (typeof excludeInstance.callback) {
          case "boolean":
            return Boolean(excludeInstance.callback);
          case "function":
            return excludeInstance.callback(Reflect.get(this, field), this);
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

    try {
      return cloneDeep(result);
    } catch {
      if(result) return { ...(result) };

      return result;
    }
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
  @computed.struct public get service() {
    return {
        dirty         : this.dirty,
        dumpData      : this.dumpData,
        // toJSON        : this.serviceToJSON,
        loadData      : (data?: Partial<T>): Model<T> => this.loadData(data),
        validation    : this.validation,
        reject        : this.reject.bind(this),
        commit        : this.commit.bind(this),
        commitField   : this.commitField.bind(this),
        changes       : this.changes,
        inverseChanges: this.inverseChanges,
        history       : this.history,
        historyIndex  : this.historyIndex,
        toInit        : (): Model<T> => this.toInit(),
        undo          : this.undo.bind(this),
        redo          : this.redo.bind(this),
        goToHistory   : this.goToHistory.bind(this)
    };
  }
}

export * from './types';
export * from './devtools';
