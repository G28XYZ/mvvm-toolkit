import { isEqual, isEmpty } from "lodash";
import { action, computed, isObservable, observable, runInAction } from "mobx";
import {
  FieldMetadata,
  SubmitMetadata,
  ValidationMetadata,
  ExcludeMetadata,
  IFieldMetadata,
  ISubmitMetadata,
  IExcludeMetadata,
} from "./data";
import { ModelOptions, ModelService, TModel, IMetadataModel } from "./types";
import { EXCLUDE_METADATA_KEY, FIELD_METADATA_KEY, SUBMIT_METADATA_KEY, VALIDATION_METADATA_KEY } from "./meta";
/** */
const submitMetadata = new SubmitMetadata();
/** */
const fieldMetadata = new FieldMetadata();
/** */
const validationMetadata = new ValidationMetadata();
/** */
const excludeMetadata = new ExcludeMetadata();
type MetaCache<T> = { ownRef: unknown; protoRef: unknown; list: T[]; map: Map<string, T> };
type MetaCacheSlot<T> = MetaCache<T> | true | null;

/**
 * Класс для управлением состоянием модели.
 */
export class Model<T extends Record<string, any> = any > implements TModel<any> {
  @observable
  // @define_prop
  protected accessor initData: Partial<T> = null;

  // @define_prop
  protected accessor committedData: Partial<T> = {};

  // @define_prop
  private accessor modified_: Partial<T> = {};

  // @define_prop
  private accessor legacyInitDone = false;

  // @define_prop
  private accessor options: ModelOptions<T> = {};

  private accessor [FIELD_METADATA_KEY]: MetaCacheSlot<IFieldMetadata<any, any>>;
  private accessor [SUBMIT_METADATA_KEY]: MetaCacheSlot<ISubmitMetadata>;
  private accessor [EXCLUDE_METADATA_KEY]: MetaCacheSlot<IExcludeMetadata>;
  private accessor [VALIDATION_METADATA_KEY]: MetaCacheSlot<IMetadataModel>;

  /**
   * Создает модель и инициализирует данные.
   */
  constructor(data: Partial<T> = {}, options?: ModelOptions<T> ) {
    this.options = options;
    this.init(data);
    this.initLegacyFields();
  }

  private getFieldMetaCache() {
    const ownRef = Reflect.getOwnMetadata(FIELD_METADATA_KEY, this);
    const proto = Object.getPrototypeOf(this);
    const protoRef = proto ? Reflect.getOwnMetadata(FIELD_METADATA_KEY, proto) : null;
    const cached = this[FIELD_METADATA_KEY];
    if (cached && cached !== true && cached.ownRef === ownRef && cached.protoRef === protoRef) return cached;

    const list = fieldMetadata.fields(this);
    const map = new Map<string, IFieldMetadata<any, any>>();
    for (const item of list) {
      map.set(String(item.name), item);
    }
    this[FIELD_METADATA_KEY] = { ownRef, protoRef, list, map };
    return this[FIELD_METADATA_KEY];
  }

  private getFieldMeta(name: string): IFieldMetadata<any, any> | undefined {
    return this.getFieldMetaCache().map.get(String(name));
  }

  private getSubmitMetaCache(): MetaCache<ISubmitMetadata> {
    const ownRef = Reflect.getOwnMetadata(SUBMIT_METADATA_KEY, this);
    const proto = Object.getPrototypeOf(this);
    const protoRef = proto ? Reflect.getOwnMetadata(SUBMIT_METADATA_KEY, proto) : null;
    const cached = this[SUBMIT_METADATA_KEY];
    if (cached && cached !== true && cached.ownRef === ownRef && cached.protoRef === protoRef) return cached;

    const list = submitMetadata.fields(this);
    const map = new Map<string, ISubmitMetadata>();
    for (const item of list) {
      map.set(String(item.name), item);
    }
    const next = { ownRef, protoRef, list, map };
    this[SUBMIT_METADATA_KEY] = next;
    return next;
  }

  private getExcludeMetaCache(): MetaCache<IExcludeMetadata> {
    const ownRef = Reflect.getOwnMetadata(EXCLUDE_METADATA_KEY, this);
    const proto = Object.getPrototypeOf(this);
    const protoRef = proto ? Reflect.getOwnMetadata(EXCLUDE_METADATA_KEY, proto) : null;
    const cached = this[EXCLUDE_METADATA_KEY];
    if (cached && cached !== true && cached.ownRef === ownRef && cached.protoRef === protoRef) return cached;

    const list = excludeMetadata.fields(this);
    const map = new Map<string, IExcludeMetadata>();
    for (const item of list) {
      map.set(String(item.name), item);
    }
    const next = { ownRef, protoRef, list, map };
    this[EXCLUDE_METADATA_KEY] = next;
    return next;
  }

  private getValidationMetaCache(): MetaCache<IMetadataModel> {
    const ownRef = Reflect.getOwnMetadata(VALIDATION_METADATA_KEY, this);
    const proto = Object.getPrototypeOf(this);
    const protoRef = proto ? Reflect.getOwnMetadata(VALIDATION_METADATA_KEY, proto) : null;
    const cached = this[VALIDATION_METADATA_KEY];
    if (cached && cached !== true && cached.ownRef === ownRef && cached.protoRef === protoRef) return cached;

    const list = validationMetadata.fields(this);
    const map = new Map<string, IMetadataModel>();
    for (const item of list) {
      map.set(String(item.name), item);
    }
    const next = { ownRef, protoRef, list, map };
    this[VALIDATION_METADATA_KEY] = next;
    return next;
  }

  /**
   * Инициализировать валидацию для поля или всех полей.
   */
  private initValidation(field?: string) {
    const validation = this.validation;
    if (field) Reflect.get(validation, field);
    else for (let validationKey in validation) validation[validationKey];
  }

  /**
   * Полная инициализация модели и полей.
   */
  protected init(data: Partial<T> = {}) {
    this.cloneForInit(data);
    this.defineData(this.initData);
  }

  /**
   * Инициализировать отдельное поле модели.
   */
  protected initField(field: string, options?: { skipValidation?: boolean }) {
    const fieldInstance = this.getFieldMeta(field);
    if (fieldInstance) {
      const fieldName = String(fieldInstance.name);
      const hasOwnValue = Object.prototype.hasOwnProperty.call(this.initData, fieldName);
      if (!hasOwnValue) Reflect.set(this.initData, fieldName, Reflect.get(this, fieldName));
      let value = fieldInstance?.factory
        ? fieldInstance.factory(this.initData, this)
        : Reflect.get(this.initData, fieldName);
      if (value === undefined && !fieldInstance?.factory) {
        const fallback = Reflect.get(this, fieldName);
        if (fallback !== undefined) {
          value = fallback;
          Reflect.set(this.initData, fieldName, fallback);
        }
      }
      this.defineFieldValue(field, value, fieldInstance);
      if (!options?.skipValidation) this.initValidation(field);
    }
  }

  private initLegacyFields() {
    if (this.legacyInitDone) return;
    const fields = this.getFieldMetaCache().list;
    if (!fields.some((field) => Object.prototype.hasOwnProperty.call(this, field.name))) return;
    this.legacyInitDone = true;
    for (let field of fields) {
      const fieldName = String(field.name);
      if (this.initData && fieldName in this.initData) continue;
      this.initField(fieldName, { skipValidation: true });
    }
  }

  // @define_prop
  // private readonly serviceToJSON = () => this.dumpData;
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
    fieldInstance?: IFieldMetadata<any, any>
  ) {
    const resolvedFieldInstance = fieldInstance ?? this.getFieldMeta(field);

    if (value && typeof value === "object") {
      // TODO - может убрать...
      // value = this.createObservable(value, field, field);
    }

    if(resolvedFieldInstance.noObserve) {
      Reflect.defineProperty(this, resolvedFieldInstance.name, { value })
    } else {

      value = observable.box(value);

      Reflect.defineProperty(this, resolvedFieldInstance.name, {
        get: () => value.get(),
        set: (v) => {
          runInAction(() => value.set(v));
          this.checkChange(resolvedFieldInstance.name, value.get());
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
        return;
      }
      if (field in this.modified_ && isEqual(originValue, value)) {
        delete this.modified_[field as keyof T];
      }
    });

    return isChanged;
  }

  /**
   * Применить данные к полям модели.
   */
  private defineData(data: Partial<T>) {
    const fieldMap = this.getFieldMetaCache().map;
    for (let field in this) {
      if (!Object.prototype.hasOwnProperty.call(this, field)) continue;
      if (fieldMap.has(field)) {
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
    for (let field of this.getFieldMetaCache().list) this.commitField(field.name);

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
    this.init(this.initData);
    return this;
  }

  /**
   * Перезагрузить данные модели.
   */
  protected loadData(data?: Partial<T>): Model<T> {
    this.init(data);
    return this;
  }

  /**
   * Получить сериализованный дамп данных.
   */
  protected get dumpData(): T {
    this.initLegacyFields();
    const result: T = Object.create({});

    const submitMap = this.getSubmitMetaCache().map;
    const excludeMap = this.getExcludeMetaCache().map;

    const getValue = (field: string) => {
      const value = Reflect.get(this, field);
      const submitInstance = submitMap.get(field);
      const callback = submitInstance?.callback;
      return typeof callback === "function" ? callback(value, this) : value;
    };

    const isExcludeField = (field: string) => {
      const excludeInstance = excludeMap.get(field);
      if (excludeInstance) {
        switch (typeof excludeInstance.callback) {
          case "boolean":  return Boolean(excludeInstance.callback);
          case "function": return excludeInstance.callback(Reflect.get(this, field), this);
        }
      }

      return false;
    };

    this.getFieldMetaCache().list.forEach((item) => {
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

    for (const item of this.getValidationMetaCache().list) {
      const fieldName = String(item.name);
      Reflect.set(validation, fieldName, item.callback(Reflect.get(this, fieldName), this) || "");
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
    "loadData" | "reject" | "commit" | "commitField" | "toInit"
  > {
    return {
      loadData   : (data?: Partial<T>): Model<T> => this.loadData(data),
      reject     : (): void => this.reject(),
      commit     : (): void => this.commit(),
      commitField: (field: keyof T): void => this.commitField(field),
      toInit     : (): Model<T> => this.toInit(),
    }
  };

  @computed.struct public get service(): ModelService<T> {
    return {
        dirty         : this.dirty,
        dumpData      : this.dumpData,
        // toJSON        : this.serviceToJSON,
        validation    : this.validation,
        ...this.serviceApi,
    };
  }
}

export * from './types';
