import { VALIDATION_METADATA_KEY, SUBMIT_METADATA_KEY, EXCLUDE_METADATA_KEY, FIELD_METADATA_KEY, PROP_FROM_VIEW_METADATA_KEY } from "./meta";
import { IMetadataModel } from "./types";


/**
 * Базовая модель метаданных для декораторов.
 */
class MetadataModel<T extends IMetadataModel = any> implements IMetadataModel {
  name: string;
  callback?: T["callback"];
  metadataKey: symbol | string = null;

  isInit: boolean = false;

  /**
   * Кеш метаданных по prototype.
   * Важно: в библиотеке используются singleton-экземпляры метаданных
   * (fieldMetadata/submitMetadata/validationMetadata/...), поэтому этот кеш
   * эффективно переиспользуется между всеми экземплярами Model.
   */
  private readonly cache = new WeakMap<object, { ownRef: unknown; list: T[]; map: Map<string, T> }>();

  private isPrototypeObject(target: any): boolean {
    const ctor = target?.constructor;
    return Boolean(ctor && ctor.prototype === target);
  }

  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  private getCacheTarget(target: any): object | null {
    if (!target || typeof target !== "object") return null;
    return this.isPrototypeObject(target) ? target : Object.getPrototypeOf(target);
  }

  private computeFromPrototype(proto: object): { ownRef: unknown; list: T[]; map: Map<string, T> } {
    const result: T[] = [];
    const map = new Map<string, T>();
    const seen = new Set<string>();

    let current: any = proto;
    while (current) {
      const items = Reflect.getOwnMetadata(this.metadataKey, current) as T[] | undefined;
      if (Array.isArray(items)) {
        for (const item of items) {
          const name = item?.name;
          const key = String(name);
          if (seen.has(key)) continue;
          seen.add(key);
          result.push(item);
          map.set(key, item);
        }
      }
      current = Object.getPrototypeOf(current);
    }

    const ownRef = Reflect.getOwnMetadata(this.metadataKey, proto);
    return { ownRef, list: result, map };
  }

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
    // если метаданные лежат на инстансе (редко/legacy), то кешировать нельзя
    const own = target && typeof target === "object" ? (Reflect.getOwnMetadata(this.metadataKey, target) as T[] | undefined) : undefined;
    if (Array.isArray(own)) return own.find((item) => item.name === name);

    const proto = this.getCacheTarget(target);
    if (!proto) return undefined;

    const ownRef = Reflect.getOwnMetadata(this.metadataKey, proto);
    const cached = this.cache.get(proto);
    if (!cached || cached.ownRef !== ownRef) {
      const next = this.computeFromPrototype(proto);
      this.cache.set(proto, next);
      return next.map.get(String(name));
    }

    return cached.map.get(String(name));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(target: any): T[] {
    // если метаданные лежат на инстансе (редко/legacy), то кешировать нельзя
    const own = target && typeof target === "object" ? (Reflect.getOwnMetadata(this.metadataKey, target) as T[] | undefined) : undefined;
    if (Array.isArray(own)) {
      // fallback: старое поведение, учитывающее цепочку прототипов + инстанс
      const result: T[] = [];
      const seen = new Set<string>();
      let current = target;
      while (current) {
        const items = Reflect.getOwnMetadata(this.metadataKey, current) as T[] | undefined;
        if (Array.isArray(items)) {
          for (const item of items) {
            const name = (item as Partial<IMetadataModel>)?.name;
            const key = String(name);
            if (seen.has(key)) continue;
            seen.add(key);
            result.push(item);
          }
        }
        current = Object.getPrototypeOf(current);
      }
      return result;
    }

    const proto = this.getCacheTarget(target);
    if (!proto) return [];

    const ownRef = Reflect.getOwnMetadata(this.metadataKey, proto);
    const cached = this.cache.get(proto);
    if (cached && cached.ownRef === ownRef) return cached.list;

    const next = this.computeFromPrototype(proto);
    this.cache.set(proto, next);
    return next.list;
  }
}
/**
 * Метаданные для validation декоратора.
 */
export class ValidationMetadata extends MetadataModel<IMetadataModel> {
  metadataKey = VALIDATION_METADATA_KEY;
}

export interface ISubmitMetadata extends IMetadataModel {
  callback?(value: any, instance: any): any;
}

/**
 * Метаданные для submit декоратора.
 */
export class SubmitMetadata extends MetadataModel<ISubmitMetadata> implements ISubmitMetadata {
  metadataKey = SUBMIT_METADATA_KEY;
}

export interface IExcludeMetadata extends Omit<IMetadataModel, "callback"> {
  callback?: boolean | ((value: any, instance: any) => boolean);
}

/**
 * Метаданные для exclude декоратора.
 */
export class ExcludeMetadata extends MetadataModel<IExcludeMetadata> implements IExcludeMetadata {
  metadataKey = EXCLUDE_METADATA_KEY;
}

export interface IFieldMetadata<T = any, I = any> extends IMetadataModel {
  /** метод для переопределения номинального значения */
  factory?: (data: T, instance: I) => any;
  /**
   * метод для переопределения поля в модели
   * @todo - еще не реализован, доделать
   **/
  mapping?: (data: T, instance: I) => any;
  /** не наблюдаемое поле */
  noObserve?: boolean;
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
  factory       ?: IFieldMetadata["factory"]   = null;
  mapping       ?: IFieldMetadata["mapping"]   = null;
  noObserve     ?: IFieldMetadata["noObserve"] = null;
  collectChanges?: boolean                     = false;

  name: string = null;
  ctx: ClassFieldDecoratorContext = null;
  metadataKey = FIELD_METADATA_KEY;

  isInit: boolean = false;

  /**
   * Создать метаданные поля модели.
   */
  constructor(props: Partial<IFieldMetadata> = {}) {
    super(props);
    this.factory   = props.factory;
    this.mapping   = props.mapping;
    this.noObserve = props.noObserve;
    this.name      = props.name;
    this.ctx       = props.ctx;
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
  metadataKey = PROP_FROM_VIEW_METADATA_KEY;

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
