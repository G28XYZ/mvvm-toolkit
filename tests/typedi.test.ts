import { describe, expect, it } from "vitest";
import { GetService, Inject, Service, SetService } from "../src/typedi";


describe("typedi", () => {
  it("регистрирует и резолвит сервисы", () => {
    @Service
    class RootService {
      value = 1;
    }

    const service = GetService(RootService, "instance");
    expect(service).toBeInstanceOf(RootService);
    expect(service?.value).toBe(1);
  });

  it("резолвит сервисы по id", () => {
    @Service({ id: "by-id" })
    class ByIdService {
      value = "ok";
    }

    const service = GetService<ByIdService>("by-id", "instance");
    expect(service).toBeInstanceOf(ByIdService);
    expect(service?.value).toBe("ok");
  });

  it("создает transient инстансы", () => {
    @Service({ id: "transient", transient: true })
    class TransientService {
      id = Math.random();
    }

    const first = GetService("transient", "instance");
    const second = GetService("transient", "instance");

    expect(first).toBeInstanceOf(TransientService);
    expect(second).toBeInstanceOf(TransientService);
    expect(first).not.toBe(second);
  });

  it("создает lazy инстанс при первом доступе", () => {
    let created = 0;

    @Service({ id: "lazy", lazy: true })
    class LazyService {
      constructor() {
        created += 1;
      }
    }

    const service = GetService("lazy");
    expect(created).toBe(0);

    const instance = GetService("lazy", "instance");
    expect(instance).toBeInstanceOf(LazyService);
    expect(created).toBe(1);

    const again = GetService("lazy", "instance");
    expect(again).toBe(instance);
    expect(created).toBe(1);
  });

  it("инжектит сервисы в поля", async () => {
    @Service
    class DepService {
      name = "dep";
    }

    class Consumer {
      @Inject(DepService)
      dep: DepService | null = null;
    }

    const consumer = new Consumer();

    expect(consumer.dep).toBeInstanceOf(DepService);
    expect(consumer.dep?.name).toBe("dep");
  });

  it("поддерживает ручную регистрацию сервиса", () => {
    class ManualService {
      value = 42;
    }

    const instance = SetService(ManualService, { id: "manual", ctx: { name: "manual" } });
    const service = GetService("manual", "instance");

    expect(service).toBeInstanceOf(ManualService);
    expect(service).toBe(instance);
    expect(service?.value).toBe(42);
  });

  it("поддерживает legacy Service и Inject", () => {
    class LegacyDep {
      value = "ok";
    }

    Service(LegacyDep);

    class LegacyConsumer {
      dep: LegacyDep | null = null;
    }

    Inject(LegacyDep)(LegacyConsumer.prototype, "dep");

    const consumer = new LegacyConsumer();
    expect(consumer.dep).toBeInstanceOf(LegacyDep);
    expect(consumer.dep?.value).toBe("ok");
  });

  // createServiceContainer removed
});
