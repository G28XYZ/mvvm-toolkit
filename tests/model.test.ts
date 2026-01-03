import { describe, expect, it } from "vitest";
import { Model, field, submit, exclude, validation, type TModel } from "../src";

interface ExampleData {
  id    : number;
  name  : string;
  views : number;
  tags  : string[];
  count : number;
  meta ?: { label: string } | null;
}

class ExampleModel extends Model<ExampleData> implements TModel<ExampleData> {
  @field
  id: number = 0;

  @field
  @submit((value) => (value ? String(value).toUpperCase() : value))
  name: string = "";

  @field
  @validation((value: number) => (value > 10 ? "too high" : ""))
  views: number = 0;

  @field
  @exclude(true)
  tags: string[] = [];

  @field({ collectChanges: true })
  count: number = 0;

  @field
  meta: { label: string } | null = null;
}

class FactoryModel extends Model<ExampleData> implements TModel<ExampleData> {
  @field({
    factory: (data) => (data.name ? `${data.name}-factory` : data.name),
  })
  name: string = "";

  @field
  id: number = 0;

  @field
  views: number = 0;

  @field
  tags: string[] = [];

  @field({ collectChanges: true })
  count: number = 0;
}

class ExcludeByCallbackModel extends Model<ExampleData> implements TModel<ExampleData> {
  @field
  id: number = 0;

  @field
  name: string = "";

  @field
  views: number = 0;

  @field
  tags: string[] = [];

  @field
  @exclude((value, instance) => instance.views > 0)
  count: number = 0;
}

class NestedModel extends Model<Pick<ExampleData, "id" | "meta">> implements TModel<Pick<ExampleData, "id" | "meta">> {
  @field
  id: number = 0;

  @field({ collectChanges: true })
  meta: { label: string } = { label: "init" };
}

describe("Model", () => {
  it("поддерживает legacy декораторы модели", () => {
    class LegacyModel extends Model<{ name: string; count: number; tags: string[] }> {
      name = "";
      count = 0;
      tags: string[] = [];
    }

    field(LegacyModel.prototype, "name");
    field({ collectChanges: true })(LegacyModel.prototype, "count");
    field(LegacyModel.prototype, "tags");
    submit((value) => value?.trim())(LegacyModel.prototype, "name");
    exclude(true)(LegacyModel.prototype, "tags");
    validation((value: number) => (value > 1 ? "too high" : ""))(LegacyModel.prototype, "count");

    const model = new LegacyModel({ name: " ok ", count: 1, tags: ["x"] });

    expect(model.service.dumpData).toEqual({
      name: "ok",
      count: 1,
    });


    model.count = 2;
    expect(model.service.validation.count).toBe("too high");
    expect(model.service.changes.length).toBeGreaterThan(0);
    expect(model.service.changes[0]?.field).toBe("count");
  });

  it("отслеживает dirty и поддерживает commit/reject", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 5, tags: ["tag"], count: 0 });

    expect(model.service.dirty).toBe(false);

    model.name = "beta";
    expect(model.service.dirty).toBe(true);

    model.service.commit();
    expect(model.service.dirty).toBe(false);

    model.name = "gamma";
    model.service.reject();
    expect(model.name).toBe("beta");
  });

  it("применяет submit и exclude в dumpData", () => {
    const model = new ExampleModel({ id: 2, name: "alpha", views: 3, tags: ["tag"], count: 1 });

    const dump = model.service.dumpData;

    expect(dump).toEqual({
      id: 2,
      name: "ALPHA",
      views: 3,
      count: 1,
      meta: null,
    });
  });

  it("собирает патчи только для полей с collectChanges", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.count = 1;
    const withChanges = model.service.changes.length;
    expect(withChanges).toBeGreaterThan(0);
    expect(model.service.changes[0]?.field).toBe("count");

    model.views = 2;
    expect(model.service.changes.length).toBe(withChanges);
  });

  it("возвращает результаты validation", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 5, tags: [], count: 0 });

    expect(model.service.validation.views).toBe("");

    model.views = 25;
    expect(model.service.validation.views).toBe("too high");
  });

  it("не сбрасывает изменения при позднем initLegacyFields", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.name = "beta";
    expect(model.name).toBe("beta");

    expect(model.service.validation.views).toBe("");
    expect(model.name).toBe("beta");
  });

  it("использует factory при инициализации", () => {
    const model = new FactoryModel({ id: 3, name: "sample", views: 0, tags: [], count: 0 });

    expect(model.name).toBe("sample-factory");
  });

  it("учитывает byFields в dumpData", () => {
    const model = new ExampleModel(
      { id: 5, name: "alpha", views: 2, tags: ["tag"], count: 1, meta: { label: "x" } },
      { byFields: ["id", "meta"] }
    );

    expect(model.service.dumpData).toEqual({
      id: 5,
      meta: { label: "x" },
    });
  });

  it("поддерживает commitField и сохраняет dirty для других изменений", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.name = "beta";
    model.views = 2;

    model.service.commitField("name");
    expect(model.name).toBe("beta");
    expect(model.service.dirty).toBe(true);
  });

  it("делает reject до последних закоммиченных значений", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.name = "beta";
    model.service.commit();

    model.name = "gamma";
    model.views = 3;
    model.service.reject();

    expect(model.name).toBe("beta");
    expect(model.views).toBe(1);
  });

  it("сбрасывает к init данным", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.name = "beta";
    model.views = 3;

    model.service.toInit();
    expect(model.name).toBe("alpha");
    expect(model.views).toBe(1);
    expect(model.service.dirty).toBe(false);
  });

  it("перезагружает данные через loadData", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.name = "beta";
    model.service.loadData({ id: 2, name: "next", views: 5, tags: ["t"], count: 4 });

    expect(model.id).toBe(2);
    expect(model.name).toBe("next");
    expect(model.views).toBe(5);
    expect(model.service.dirty).toBe(false);
  });

  it("применяет exclude callback по условию", () => {
    const model = new ExcludeByCallbackModel({ id: 1, name: "alpha", views: 0, tags: [], count: 2 });
    expect(model.service.dumpData).toEqual({
      id: 1,
      name: "alpha",
      views: 0,
      tags: [],
      count: 2,
    });

    model.views = 1;
    expect(model.service.dumpData).toEqual({
      id: 1,
      name: "alpha",
      views: 1,
      tags: [],
    });
  });

  it("отслеживает вложенные изменения для collectChanges", () => {
    const model = new NestedModel({ id: 1, meta: { label: "init" } });

    model.meta.label = "next";

    expect(model.service.dirty).toBe(true);
    expect(model.service.changes.length).toBeGreaterThan(0);
    expect(model.service.changes[0]?.field).toBe("meta");
  });

  it("оставляет validation пустой для undefined", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: undefined, tags: [], count: 0 });

    expect(model.service.validation.views).toBe("");
  });

  it("поддерживает историю и перемещение по шагам", () => {
    const model = new ExampleModel({ id: 1, name: "alpha", views: 1, tags: [], count: 0 });

    model.count = 1;
    model.count = 2;

    expect(model.service.history.length).toBe(2);
    expect(model.service.historyIndex).toBe(1);

    model.service.undo();
    expect(model.count).toBe(1);
    expect(model.service.historyIndex).toBe(0);

    model.service.redo();
    expect(model.count).toBe(2);
    expect(model.service.historyIndex).toBe(1);

    model.service.goToHistory(-1);
    expect(model.count).toBe(0);
    expect(model.service.historyIndex).toBe(-1);
  });
});
