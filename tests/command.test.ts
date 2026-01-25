import { describe, expect, it, vi } from "vitest";
import { asyncCommand, commandAction, flowCommand, DEFAULT_STATES } from "../src";

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

const flushPromises = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe("command", () => {
  it("управляет состоянием выполнения и canExecute", async () => {
    const deferred = createDeferred<number>();
    const cmd = asyncCommand(async () => deferred.promise);

    expect(cmd.result).toBeUndefined();

    const promise = cmd.execute();
    expect(cmd.isExecuting).toBe(true);
    expect(cmd.canExecute).toBe(false);
    expect(cmd.result).toBeUndefined();

    deferred.resolve(7);
    const result = await promise;

    expect(result).toBe(7);
    expect(cmd.result).toBe(7);

    expect(cmd.isExecuting).toBe(false);
    expect(cmd.canExecute).toBe(true);
    expect(cmd.error).toBe(null);
  });

  it("возвращает state в зависимости от статуса", async () => {
    const deferred = createDeferred<void>();
    const cmd = asyncCommand(async () => deferred.promise);

    expect(cmd.state).toBe("ready");
    expect(cmd.result).toBeUndefined();

    const promise = cmd.execute();
    expect(cmd.state).toBe("load");
    expect(cmd.result).toBeUndefined();

    deferred.resolve();
    await promise;

    expect(cmd.state).toBe("ready");
    expect(cmd.result).toBeUndefined();

    const errorCmd = asyncCommand(async () => {
      throw new Error("boom");
    });

    await errorCmd.execute();
    expect(errorCmd.state).toBe("failure");
    expect(errorCmd.result).toBeUndefined();
  });

  it("canExecute получает scope и может проверять state", async () => {
    const deferred = createDeferred<void>();
    const cmd = asyncCommand(async () => deferred.promise, {
      concurrency: "parallel",
      canExecute: ({ state, states }) => state === states.ready,
    });

    expect(cmd.canExecute).toBe(true);

    const promise = cmd.execute();
    expect(cmd.canExecute).toBe(false);

    deferred.resolve();
    await promise;

    expect(cmd.canExecute).toBe(true);
  });

  it("activeCount отражает количество активных запусков", async () => {
    const first = createDeferred<void>();
    const second = createDeferred<void>();

    const cmd = asyncCommand(async (label: "first" | "second") => {
      if (label === "first") {
        await first.promise;
        return;
      }
      await second.promise;
    }, {
      concurrency: "parallel",
    });

    const p1 = cmd.execute("first");
    const p2 = cmd.execute("second");

    expect(cmd.activeCount).toBe(2);
    expect(cmd.isExecuting).toBe(true);

    first.resolve();
    await p1;
    expect(cmd.activeCount).toBe(1);

    second.resolve();
    await p2;

    expect(cmd.activeCount).toBe(0);
    expect(cmd.isExecuting).toBe(false);
  });

  it("использует дефолтные состояния", async () => {
    const deferred = createDeferred<void>();
    const cmd = asyncCommand(async () => deferred.promise);

    expect(cmd.states).toEqual(DEFAULT_STATES);
    expect(cmd.state).toBe(DEFAULT_STATES.ready);

    const promise = cmd.execute();
    expect(cmd.state).toBe(DEFAULT_STATES.load);

    deferred.resolve();
    await promise;

    expect(cmd.state).toBe(DEFAULT_STATES.ready);
  });

  it("ignore возвращает текущий промис при повторном вызове", async () => {
    const deferred = createDeferred<void>();
    const fn = vi.fn(async () => deferred.promise);
    const cmd = asyncCommand(fn, { concurrency: "ignore" });

    const first = cmd.execute();
    const second = cmd.execute();

    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);

    deferred.resolve();
    await first;
  });

  it("queue выполняет команды последовательно", async () => {
    const order: string[] = [];
    const first = createDeferred<void>();
    const second = createDeferred<void>();

    const cmd = asyncCommand(async (label: "first" | "second") => {
      order.push(`start:${label}`);
      if (label === "first") {
        await first.promise;
      } else {
        await second.promise;
      }
      order.push(`end:${label}`);
    }, {
      concurrency: "queue",
    });

    const p1 = cmd.execute("first");
    const p2 = cmd.execute("second");

    await flushPromises();
    expect(order).toEqual(["start:first"]);

    first.resolve();
    await p1;

    await flushPromises();
    expect(order).toEqual(["start:first", "end:first", "start:second"]);

    second.resolve();
    await p2;

    expect(order).toEqual(["start:first", "end:first", "start:second", "end:second"]);
  });

  it("clearQueue сбрасывает ожидающие вызовы", async () => {
    const deferred = createDeferred<void>();
    const fn = vi.fn(async () => deferred.promise);
    const cmd = asyncCommand(fn, { concurrency: "queue" });

    const p1 = cmd.execute();
    const p2 = cmd.execute();
    const p3 = cmd.execute();

    await flushPromises();
    cmd.clearQueue?.();

    await expect(p2).resolves.toBeUndefined();
    await expect(p3).resolves.toBeUndefined();

    deferred.resolve();
    await p1;

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancelQueued сбрасывает очередь при cancel()", async () => {
    const deferred = createDeferred<void>();
    const fn = vi.fn(async () => deferred.promise);
    const cmd = asyncCommand(fn, { concurrency: "queue", cancelQueued: true });

    const p1 = cmd.execute();
    const p2 = cmd.execute();

    await flushPromises();
    cmd.cancel?.();

    await expect(p2).resolves.toBeUndefined();

    deferred.resolve();
    await p1;

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("queueLimit ограничивает количество ожидающих вызовов", async () => {
    const first = createDeferred<void>();
    const second = createDeferred<void>();
    const fn = vi.fn(async (label: "first" | "second") => {
      if (label === "first") {
        await first.promise;
        return;
      }
      await second.promise;
    });
    const cmd = asyncCommand(fn, { concurrency: "queue", queueLimit: 1 });

    const p1 = cmd.execute("first");
    const p2 = cmd.execute("second");
    const p3 = cmd.execute("first");

    await expect(p3).resolves.toBeUndefined();
    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(1);

    first.resolve();
    await p1;

    second.resolve();
    await p2;

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("restart отменяет текущую операцию без записи ошибки", async () => {
    const first = createDeferred<"first">();
    const second = createDeferred<"second">();

    const fn = vi.fn(async (label: "first" | "second") => {
      const current = label === "first" ? first : second;
      return current.promise;
    });

    const cmd = asyncCommand(fn, { concurrency: "restart" });

    const p1 = cmd.execute("first");
    const p2 = cmd.execute("second");

    first.resolve("first");
    const result1 = await p1;
    expect(result1).toBeUndefined();
    expect(cmd.result).toBeUndefined();

    second.resolve("second");
    const result2 = await p2;
    expect(result2).toBe("second");

    // важно: отменённый первый запуск не должен “затереть” успешный результат второго
    expect(cmd.result).toBe("second");
    expect(cmd.error).toBe(null);
  });

  it("isCanceled выставляется при cancel и сбрасывается новым запуском", async () => {
    const first = createDeferred<void>();
    const second = createDeferred<void>();
    let current = first;

    const fn = vi.fn(async () => current.promise);

    const cmd = asyncCommand(fn);

    const p1 = cmd.execute();
    expect(cmd.isCanceled).toBe(false);

    cmd.cancel?.();
    expect(cmd.isCanceled).toBe(true);
    expect(cmd.result).toBeUndefined();

    first.resolve();
    await p1;

    current = second;
    const p2 = cmd.execute();
    expect(cmd.isCanceled).toBe(false);

    second.resolve();
    await p2;

    expect(cmd.result).toBeUndefined();
  });

  it("dispose помечает команду как недоступную", async () => {
    const cmd = asyncCommand(async () => 1);

    cmd.dispose?.();

    expect(cmd.isDisposed).toBe(true);
    expect(cmd.canExecute).toBe(false);
    expect(cmd.result).toBeUndefined();
    await expect(cmd.execute()).resolves.toBeUndefined();
  });

  it("resetErrorOnExecute очищает error при новом запуске", async () => {
    const error = new Error("boom");
    let fail = true;
    const cmd = asyncCommand(async () => {
      if (fail) {
        fail = false;
        throw error;
      }
      return 1;
    });

    await cmd.execute();
    expect(cmd.error).toBe(error);
    expect(cmd.result).toBeUndefined();

    const promise = cmd.execute();
    expect(cmd.error).toBe(null);

    await promise;
    expect(cmd.error).toBe(null);
    expect(cmd.result).toBe(1);
  });

  it("resetErrorOnExecute=false сохраняет error до ручного сброса", async () => {
    const error = new Error("boom");
    let fail = true;
    const cmd = asyncCommand(async () => {
      if (fail) {
        fail = false;
        throw error;
      }
      return 1;
    }, { resetErrorOnExecute: false });

    await cmd.execute();
    expect(cmd.error).toBe(error);
    expect(cmd.result).toBeUndefined();

    const promise = cmd.execute();
    expect(cmd.error).toBe(error);

    await promise;
    expect(cmd.error).toBe(error);
    expect(cmd.result).toBe(1);

    cmd.resetError();
    expect(cmd.error).toBe(null);
  });

  it("хуки onStart/onSuccess/onFinally вызываются при успешном выполнении", async () => {
    const onStart = vi.fn();
    const onSuccess = vi.fn();
    const onFinally = vi.fn();

    const cmd = asyncCommand(async (value: number) => value + 1, {
      onStart,
      onSuccess,
      onFinally,
    });

    const result = await cmd.execute(2);

    expect(result).toBe(3);
    expect(cmd.result).toBe(3);

    expect(onStart).toHaveBeenCalledWith(2);
    expect(onSuccess).toHaveBeenCalledWith(3, 2);
    expect(onFinally).toHaveBeenCalledWith({ ok: true, canceled: false, error: null }, 2);
  });

  it("хуки onStart/onFinally вызываются при ошибке", async () => {
    const error = new Error("boom");
    const onStart = vi.fn();
    const onSuccess = vi.fn();
    const onFinally = vi.fn();
    const onError = vi.fn();

    const cmd = asyncCommand(async () => {
      throw error;
    }, {
      onStart,
      onSuccess,
      onFinally,
      onError,
    });

    await cmd.execute();

    expect(cmd.result).toBeUndefined();

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
    expect(onFinally).toHaveBeenCalledWith({ ok: false, canceled: false, error });
  });

  it("хуки onFinally отмечают cancel", async () => {
    const deferred = createDeferred<void>();
    const onStart = vi.fn();
    const onSuccess = vi.fn();
    const onFinally = vi.fn();

    const cmd = asyncCommand(async () => deferred.promise, {
      onStart,
      onSuccess,
      onFinally,
    });

    const promise = cmd.execute();
    cmd.cancel?.();
    deferred.resolve();

    await promise;

    expect(cmd.result).toBeUndefined();

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledWith({ ok: false, canceled: true, error: null });
  });

  it("сохраняет ошибку и умеет пробрасывать при swallowError=false", async () => {
    const error = new Error("boom");

    const cmd = asyncCommand(async () => {
      throw error;
    });

    const result = await cmd.execute();
    expect(result).toBeUndefined();
    expect(cmd.result).toBeUndefined();
    expect(cmd.error).toBe(error);

    const cmd2 = asyncCommand(async () => {
      throw error;
    }, { swallowError: false });

    await expect(cmd2.execute()).rejects.toBe(error);
    expect(cmd2.result).toBeUndefined();
    expect(cmd2.error).toBe(error);
  });

  it("flowCommand выполняет generator и меняет состояние", async () => {
    const deferred = createDeferred<number>();
    const steps: string[] = [];

    const cmd = flowCommand(function* () {
      steps.push("start");
      const value = (yield deferred.promise) as number;
      steps.push("end");
      return value;
    });

    expect(cmd.result).toBeUndefined();

    const promise = cmd.execute();
    expect(cmd.isExecuting).toBe(true);
    expect(cmd.result).toBeUndefined();

    deferred.resolve(5);
    const result = await promise;

    expect(result).toBe(5);
    expect(cmd.result).toBe(5);

    expect(steps).toEqual(["start", "end"]);
    expect(cmd.isExecuting).toBe(false);
  });

  it("commandAction оборачивает функцию в runInAction", () => {
    let value = 0;
    const apply = commandAction((next: number) => {
      value = next;
      return value;
    });

    expect(apply(3)).toBe(3);
    expect(value).toBe(3);
  });
});
