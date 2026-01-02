import { describe, expect, it } from "vitest";
import { observable, isObservableProp } from "mobx";
import { define_prop, MakeObservable } from "../src";

describe("decorators", () => {
  it("define_prop делает поля не перечисляемыми по умолчанию", () => {
    class Sample {
      @define_prop
      hidden = 1;

      visible = 2;
    }

    const instance = new Sample();
    expect(Object.keys(instance)).toEqual(["visible"]);
    expect((instance as Sample).hidden).toBe(1);
  });

  it("MakeObservable инициализирует mobx декораторы", () => {
    @MakeObservable
    class Counter {
      @observable accessor count = 0;
    }

    const counter = new Counter();
    expect(isObservableProp(counter, "count")).toBe(true);
  });

  it("define_prop поддерживает legacy сигнатуру", () => {
    class LegacySample {
      hidden = 1;
      visible = 2;
    }

    define_prop(LegacySample.prototype, "hidden");

    const instance = new LegacySample();
    expect(Object.keys(instance)).toEqual(["visible"]);
    expect(instance.hidden).toBe(1);
  });

  it("MakeObservable поддерживает legacy сигнатуру", () => {
    class LegacyCounter {
      @observable accessor count = 0;
    }

    const Decorated = (MakeObservable(LegacyCounter) as typeof LegacyCounter) ?? LegacyCounter;
    const counter = new Decorated();
    expect(isObservableProp(counter, "count")).toBe(true);
  });
});
