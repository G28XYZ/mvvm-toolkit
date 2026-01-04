import { describe, expect, it, vi } from "vitest";
import { asyncCommand, commandAction, flowCommand } from "../src";

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

const createAbortError = (): Error => {
  const error = new Error("aborted");
  (error as { name: string }).name = "AbortError";
  return error;
};

describe("command", () => {
  it("управляет состоянием выполнения и canExecute", async () => {
    const deferred = createDeferred<number>();
    const cmd = asyncCommand(async () => deferred.promise);

    const promise = cmd.execute();
    expect(cmd.isExecuting).toBe(true);
    expect(cmd.canExecute).toBe(false);

    deferred.resolve(7);
    const result = await promise;

    expect(result).toBe(7);
    expect(cmd.isExecuting).toBe(false);
    expect(cmd.canExecute).toBe(true);
    expect(cmd.error).toBe(null);
  });

  it("возвращает state в зависимости от статуса", async () => {
    const deferred = createDeferred<void>();
    const cmd = asyncCommand(async () => deferred.promise);

    expect(cmd.state).toBe("ready");

    const promise = cmd.execute();
    expect(cmd.state).toBe("load");

    deferred.resolve();
    await promise;

    expect(cmd.state).toBe("ready");

    const errorCmd = asyncCommand(async () => {
      throw new Error("boom");
    });

    await errorCmd.execute();
    expect(errorCmd.state).toBe("failure");
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

  it("поддерживает переопределение и дополнительные состояния", async () => {
    const deferred = createDeferred<void>();
    const cmd = asyncCommand(async () => deferred.promise, {
      states: {
        ready: "idle",
        failure: "error",
        saving: "saving",
      },
      stateKeys: {
        load: "saving",
      },
    });

    expect(cmd.state).toBe("idle");

    const promise = cmd.execute();
    expect(cmd.state).toBe("saving");

    deferred.resolve();
    await promise;

    expect(cmd.state).toBe("idle");
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

  it("restart отменяет текущую операцию без записи ошибки", async () => {
    const first = createDeferred<"first">();
    const second = createDeferred<"second">();

    const fn = vi.fn(async (label: "first" | "second", signal?: AbortSignal) => {
      const current = label === "first" ? first : second;
      if (signal) {
        if (signal.aborted) throw createAbortError();
        signal.addEventListener(
          "abort",
          () => current.reject(createAbortError()),
          { once: true }
        );
      }
      return current.promise;
    });

    const cmd = asyncCommand(fn, { concurrency: "restart", abortable: true });

    const p1 = cmd.execute("first");
    const p2 = cmd.execute("second");

    second.resolve("second");

    const result2 = await p2;
    const result1 = await p1;

    expect(result2).toBe("second");
    expect(result1).toBeUndefined();
    expect(cmd.error).toBe(null);
  });

  it("сохраняет ошибку и умеет пробрасывать при swallowError=false", async () => {
    const error = new Error("boom");

    const cmd = asyncCommand(async () => {
      throw error;
    });

    const result = await cmd.execute();
    expect(result).toBeUndefined();
    expect(cmd.error).toBe(error);

    const cmd2 = asyncCommand(async () => {
      throw error;
    }, { swallowError: false });

    await expect(cmd2.execute()).rejects.toBe(error);
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

    const promise = cmd.execute();
    expect(cmd.isExecuting).toBe(true);

    deferred.resolve(5);
    const result = await promise;

    expect(result).toBe(5);
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
