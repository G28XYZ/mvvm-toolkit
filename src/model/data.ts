import { IMetadataModel } from "./types";

const FIELD_METADATA_KEY = Symbol("field-key");
const VALIDATION_METADATA_KEY = Symbol("validation-key");
const SUBMIT_METADATA_KEY = Symbol("submit-key");
const EXCLUDE_METADATA_KEY = Symbol("exclude-key");
const PROP_FROM_VIEW_METADATA_KEY = Symbol("prop-from-view-key");

/**
 * Базовая модель метаданных для декораторов.
 */
class MetadataModel<T extends IMetadataModel = any> implements IMetadataModel {
  name: string;
  callback?: T["callback"];
  protected metadataKey: symbol | string = null;

  /**
   * Создать базовые метаданные.
   */
  constructor(props: Partial<T> = {}) {
    this.name = props?.name;
    this.callback = props?.callback;
  }

  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(data: Partial<T> = {}) {
    return data instanceof MetadataModel || Object.getOwnPropertyNames(this).some((item) => Object.keys(data).includes(item));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(name: string, target: any): T {
    return this.fields(target).find((item) => item.name === name);
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(target: any): T[] {
    const result: T[] = [];
    const seen = new Set<string | symbol>();
    let current = target;

    while (current) {
      const items = Reflect.getOwnMetadata(this.metadataKey, current) as T[] | undefined;
      if (Array.isArray(items)) {
        for (const item of items) {
          const name = (item as Partial<IMetadataModel>)?.name;
          if (name !== undefined) {
            const key = typeof name === "symbol" ? name : String(name);
            if (seen.has(key)) continue;
            seen.add(key);
          }
          result.push(item);
        }
      }
      current = Object.getPrototypeOf(current);
    }

    return result;
  }
}
/**
 * Метаданные для validation декоратора.
 */
export class ValidationMetadata extends MetadataModel<IMetadataModel> {
  protected metadataKey = VALIDATION_METADATA_KEY;
}

export interface ISubmitMetadata extends IMetadataModel {
  callback?(value: any, instance: any): any;
}

/**
 * Метаданные для submit декоратора.
 */
export class SubmitMetadata extends MetadataModel<ISubmitMetadata> implements ISubmitMetadata {
  protected metadataKey = SUBMIT_METADATA_KEY;
}

export interface IExcludeMetadata extends Omit<IMetadataModel, "callback"> {
  callback?: boolean | ((value: any, instance: any) => boolean);
}

/**
 * Метаданные для exclude декоратора.
 */
export class ExcludeMetadata extends MetadataModel<IExcludeMetadata> implements IExcludeMetadata {
  protected metadataKey = EXCLUDE_METADATA_KEY;
}

export interface IFieldMetadata<T = any, I = any> extends IMetadataModel {
  /** метод для переопределения номинального значения */
  factory?: (data: T, instance: I) => any;
  /**
   * метод для переопределения поля в модели
   * @todo - еще не реализован, доделать
   **/
  mapping?: (data: T, instance: I) => any;
  /** имя поля модели */
  name: string;
  /** контекст декоратора поля */
  ctx: ClassFieldDecoratorContext;
  /**
   * признак для отслеживания и фиксации изменений значений у поля модели
   * значения складываются в массивы:
   * @param changes хранит текущие значения в момент изменения
   * @param inverseChanges хранит исходные значения в момент изменения
   * @todo - можно попробовать применить для дебага, на подобии как в девтулсах redux
   * @todo - можно применить если есть необходимость отката к исходному значению по-шагово
   **/
  collectChanges?: boolean;
}

export class FieldMetadata extends MetadataModel<IFieldMetadata> implements IFieldMetadata {
  factory?: IFieldMetadata["factory"] = null;
  mapping?: IFieldMetadata["mapping"] = null;
  collectChanges?: boolean = false;

  name: string = null;
  ctx: ClassFieldDecoratorContext = null;
  protected metadataKey = FIELD_METADATA_KEY;

  /**
   * Создать метаданные поля модели.
   */
  constructor(props: Partial<IFieldMetadata> = {}) {
    super(props);
    this.factory = props.factory;
    this.mapping = props.mapping;
    this.name = props.name;
    this.ctx = props.ctx;
    this.collectChanges = Boolean(props.collectChanges);
  }
}

interface IPropFromViewMetadata extends Omit<IMetadataModel, "callback"> {
  originName: string;
  value: any;
}

export class PropFromViewMetadata extends MetadataModel<IPropFromViewMetadata> {
  originName: string;
  value: any;
  protected metadataKey = PROP_FROM_VIEW_METADATA_KEY;

  /**
   * Создать метаданные для PropFromView.
   */
  constructor(props: Partial<IPropFromViewMetadata> = {}) {
    super(props);
    for (const field in this) {
      if (props && field in props) {
        this[field] = Reflect.get(props, field);
      }
    }
  }
}
