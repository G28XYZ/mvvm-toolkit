import { describe, expect, it } from "vitest";
import { CommandService } from "../src";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("CommandService", () => {
  it("оборачивает методы и скрывает execute", () => {
    class Store extends CommandService {
      async load() {
        return 1;
      }
      async save() {
        return 2;
      }
    }

    const store = new Store();

    expect(typeof store.load).toBe("function");
    expect(typeof store.save).toBe("function");
    expect((store.load as { execute?: unknown }).execute).toBeUndefined();
    expect((store.save as { execute?: unknown }).execute).toBeUndefined();
  });

  it("инициализирует поля состояния", () => {
    const deferred = createDeferred<number>();
    class Store extends CommandService {
      async load() {
        return deferred.promise;
      }
    }

    const store = new Store();

    expect(store.state).toBe("ready");
    expect(store.states).toEqual({
      load: "loading",
      loading: "loading",
      save: "saving",
      remove: "removing",
      delete: "deleting",
      failure: "failure",
      ready: "ready",
      canceled: "canceled",
      disposed: "disposed",
    });
    expect(store.activeCount).toBe(0);
    expect(store.isCanceled).toBe(false);
    expect(store.isDisposed).toBe(false);
    expect(store.error).toBe(null);
    expect(store.result).toBeUndefined();
  });

  it("обновляет state и isExecuting при вызове", async () => {
    const deferred = createDeferred<number>();
    class Store extends CommandService {
      async load() {
        return deferred.promise;
      }
    }

    const store = new Store();

    const promise = store.load();
    expect(store.state).toBe("loading");
    expect(store.isExecuting).toBe(true);
    expect(store.activeCount).toBe(1);

    deferred.resolve(7);
    const result = await promise;

    expect(result).toBe(7);
    expect(store.isExecuting).toBe(false);
    expect(store.activeCount).toBe(0);
    expect(store.state).toBe("ready");
    expect(store.error).toBe(null);
    expect(store.result).toBe(7);
  });

  it("прокидывает ошибку и failure-состояние", async () => {
    class Store extends CommandService {
      async load() {
        throw new Error("boom");
      }
    }

    const store = new Store();
    await store.load();

    expect(store.state).toBe("failure");
    expect(store.error).toBeInstanceOf(Error);
  });

  it("последняя команда управляет состоянием", async () => {
    const loadDeferred = createDeferred<void>();
    const saveDeferred = createDeferred<void>();

    class Store extends CommandService {
      async load() {
        return loadDeferred.promise;
      }
      async save() {
        return saveDeferred.promise;
      }
    }

    const store = new Store();

    const loadPromise = store.load();
    expect(store.state).toBe("loading");

    const savePromise = store.save();
    expect(store.state).toBe("saving");

    saveDeferred.resolve();
    await savePromise;

    expect(store.state).toBe("ready");
    expect(store.isExecuting).toBe(false);

    loadDeferred.resolve();
    await loadPromise;

    expect(store.state).toBe("ready");
  });

  it("поддерживает cancel/dispose/clearQueue", async () => {
    const deferred = createDeferred<void>();
    class Store extends CommandService {
      async load() {
        return deferred.promise;
      }
    }

    const store = new Store();

    store.load();
    expect(store.isExecuting).toBe(true);

    store.cancel?.();
    expect(store.isCanceled).toBe(true);

    store.dispose?.();
    expect(store.isDisposed).toBe(true);

    store.clearQueue?.();
    expect(store.isExecuting).toBe(true);

    deferred.resolve();
  });

  it("поддерживает resetError", async () => {
    class ErrorStore extends CommandService {
      async load() {
        throw new Error("boom");
      }
    }

    const store = new ErrorStore();
    await store.load();
    expect(store.error).toBeInstanceOf(Error);

    store.resetError?.();
    expect(store.error).toBe(null);
  });
});
