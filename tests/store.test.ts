import { describe, expect, it } from "vitest";
import { field, Model } from "../src";
import { GetStore, InjectStore, Store, StoreBase } from "../src";

const waitForInit = () => new Promise((resolve) => setTimeout(resolve, 0));

class ExampleModel extends Model<{ count: number }> {
  @field
  count = 0;
}

@Store({ id: "TestStore" })
class TestStore extends StoreBase<ExampleModel> {}

declare module "../src" {
  interface DiStores {
    TestStore: typeof TestStore;
  }
}

describe("store", () => {
  it("регистрирует Store и получает инстанс через GetStore", () => {
    const store: TestStore = GetStore("TestStore");
    expect(store).toBeInstanceOf(TestStore);
  });

  it("инжектит Store через InjectStore", async () => {
    class Consumer {
      @InjectStore("TestStore") store: TestStore = undefined;
    }

    const consumer = new Consumer();
    await waitForInit();

    expect(consumer.store).toBeInstanceOf(TestStore);
  });

  it("управляет коллекцией моделей", () => {
    const store = GetStore("TestStore");
    const model = new ExampleModel({ count: 1 });

    store.clear();
    expect(store.size).toBe(0);

    store.add(model);
    expect(store.size).toBe(1);

    store.remove(model);
    expect(store.size).toBe(0);
  });

  it("поддерживает поиск через find/filter/findBy", () => {
    const store = GetStore("TestStore");
    const first = new ExampleModel({ count: 1 });
    const second = new ExampleModel({ count: 2 });

    store.clear();
    store.add(first);
    store.add(second);

    expect(store.find((item) => item.count === 2)).toBe(second);
    expect(store.filter((item) => item.count > 0)).toHaveLength(2);
    expect(store.findBy("count", 1)).toBe(first);
  });

  it("сохраняет оригинальные данные в cash", () => {
    const store = GetStore("TestStore");
    const raw = [{ count: 3 }, { count: 4 }];

    store.applyLoaded(raw, { model: ExampleModel });

    expect(store.cash).toEqual(raw);
    expect(store.items).toHaveLength(2);
  });
});
