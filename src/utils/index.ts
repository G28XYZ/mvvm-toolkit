/**
 * Получить metadata с учетом значения по умолчанию.
 */
export const getOwnMetadata = <T, D = any>(metadataKey: symbol | string, target: T, defaultValue?: D): D extends undefined ? T : D => {
  return Reflect.getOwnMetadata(metadataKey, target as object) || defaultValue || {};
};
/**
 * Определить metadata на объекте.
 */
export const defineMetadata = <V, T = any>(metadataKey: symbol | string, metadataValue: V, target: T) =>
  Reflect.defineMetadata(metadataKey, metadataValue, target as object);

/**
 * Проверить, можно ли сериализовать аргументы.
 */
export function isSerializable(...args: any[]) {
  try {
    JSON.stringify(args);
    return true;
  } catch {
    return false;
  }
}

/**
 * Извлечь имя вызывающей функции из stack.
 */
export function getExecutingFunctionNameByStack(stack: string) {
  if (stack && typeof stack === "string") {
    let [match] =
      stack
        .split("\n")[2]
        .replace(/at (get)?/, "")
        .match(/.*/g) || [];

    if (match) match = match.trim();

    return match;
  }
}

const TODOS = {};
const _TODOS: string[] = [];
let isInitTodo = false;

/**
 * Отложенная запись TODO в консоль с уникальными путями.
 */
export const TODO = (title: string, ...msg: any[]) => {
  const stack = new Error().stack;
  if(!isInitTodo) {
    console.log(`%c TODO`, "background: #222; color: #bada55", TODOS);
    isInitTodo = true;
  } else {
    const path = getExecutingFunctionNameByStack(stack)
    if(_TODOS.includes(path) === false) {
      _TODOS.push(path);
      Reflect.set(TODOS, `${_TODOS.length}) ${title}`, { msg, get path() { console.info(msg, path); return path } });
    }
  }
  function callback(...args: any[]) {}

  return callback;
};

/** Тип конструктора класса. */
export type TInstance<T = any, A extends any[] = any[]> = new (...args: A) => T;
