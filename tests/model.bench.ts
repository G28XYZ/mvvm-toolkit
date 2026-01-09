import "reflect-metadata";
import { bench, describe } from "vitest";
import { Model, field, submit, exclude, validation } from "../src";

const FIELD_COUNT = 100;
const MODEL_COUNT = 10_000;
const FIELD_NAMES = Array.from({ length: FIELD_COUNT }, (_, i) => `f${i}`);

type LegacyDecorator = (target: object, name: string) => void;

const applyFieldDecorators = (proto: object, extras: LegacyDecorator[] = []) => {
  for (const name of FIELD_NAMES) {
    field(proto, name);
    for (const extra of extras) {
      extra(proto, name);
    }
  }
};

const BASE_DATA: Record<string, number> = {};
for (let i = 0; i < FIELD_COUNT; i++) {
  BASE_DATA[`f${i}`] = i;
}

const plainSubmit = (value: number) => value;

class PlainModel {
  private data: Record<string, number>;

  constructor(data: Record<string, number>) {
    const next: Record<string, number> = {};
    for (let i = 0; i < FIELD_NAMES.length; i++) {
      const name = FIELD_NAMES[i];
      next[name] = data[name];
    }
    this.data = next;
  }

  dumpData() {
    const result: Record<string, number> = {};
    for (let i = 0; i < FIELD_NAMES.length; i++) {
      const name = FIELD_NAMES[i];
      result[name] = this.data[name];
    }
    return result;
  }

  dumpDataWithSubmit(submitFn: (value: number) => number) {
    const result: Record<string, number> = {};
    for (let i = 0; i < FIELD_NAMES.length; i++) {
      const name = FIELD_NAMES[i];
      result[name] = submitFn(this.data[name]);
    }
    return result;
  }
}

class BulkModel extends Model<Record<string, number>> {}
class SubmitModel extends Model<Record<string, number>> {}
class ExcludeModel extends Model<Record<string, number>> {}
class ValidationModel extends Model<Record<string, number>> {}

const submitDecorator = submit((value: number) => value);
const excludeDecorator = exclude((value: number) => value < 0);
const validationDecorator = validation((value: number) => (value < 0 ? "neg" : ""));

applyFieldDecorators(BulkModel.prototype);
applyFieldDecorators(SubmitModel.prototype, [submitDecorator]);
applyFieldDecorators(ExcludeModel.prototype, [excludeDecorator]);
applyFieldDecorators(ValidationModel.prototype, [validationDecorator]);

const createPlainModel = () => new PlainModel(BASE_DATA);
const createModel = () => new BulkModel(BASE_DATA);
const createSubmitModel = () => new SubmitModel(BASE_DATA);
const createExcludeModel = () => new ExcludeModel(BASE_DATA);
const createValidationModel = () => new ValidationModel(BASE_DATA);

describe(`Plain benchmark (${FIELD_COUNT} fields)`, () => {
  bench("init only (plain)", () => {
    const model = createPlainModel();
    void model;
  });

  bench("init + dumpData (plain)", () => {
    const model = createPlainModel();
    void model.dumpData();
  });

  bench("init + dumpData (plain, submit)", () => {
    const model = createPlainModel();
    void model.dumpDataWithSubmit(plainSubmit);
  });
});

describe(`Plain benchmark (${MODEL_COUNT} models, ${FIELD_COUNT} fields)`, () => {
  bench(`init ${MODEL_COUNT}k models (plain)`, () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createPlainModel();
    }
    void models.length;
  });

  bench(`init ${MODEL_COUNT} models + dumpData (plain)`, () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createPlainModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].dumpData();
    }
  });

  bench(`init ${MODEL_COUNT} models + dumpData (plain, submit)`, () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createPlainModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].dumpDataWithSubmit(plainSubmit);
    }
  });
});

describe(`Model benchmark (${FIELD_COUNT} fields)`, () => {
  bench("init only", () => {
    const model = createModel();
    void model;
  });

  bench("init + dumpData", () => {
    const model = createModel();
    void model.service.dumpData;
  });
});

describe(`Model benchmark (${MODEL_COUNT} models, ${FIELD_COUNT} fields)`, () => {
  bench(`init ${MODEL_COUNT}k models`, () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createModel();
    }
    void models.length;
  });

  bench(`init ${MODEL_COUNT} models + dumpData`, () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].service.dumpData;
    }
  });
});

describe(`Model benchmark (${FIELD_COUNT} fields, submit)`, () => {
  bench("init + dumpData (submit)", () => {
    const model = createSubmitModel();
    void model.service.dumpData;
  });
});

describe(`Model benchmark (${MODEL_COUNT} models, ${FIELD_COUNT} fields, submit)`, () => {
  bench("init 10k models + dumpData (submit)", () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createSubmitModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].service.dumpData;
    }
  });
});

describe(`Model benchmark (${FIELD_COUNT} fields, exclude)`, () => {
  bench("init + dumpData (exclude)", () => {
    const model = createExcludeModel();
    void model.service.dumpData;
  });
});

describe(`Model benchmark (${MODEL_COUNT} models, ${FIELD_COUNT} fields, exclude)`, () => {
  bench("init 10k models + dumpData (exclude)", () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createExcludeModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].service.dumpData;
    }
  });
});

describe(`Model benchmark (${FIELD_COUNT} fields, validation)`, () => {
  bench("init + validation", () => {
    const model = createValidationModel();
    void model.service.validation;
  });
});

describe(`Model benchmark (${MODEL_COUNT} models, ${FIELD_COUNT} fields, validation)`, () => {
  bench("init 10k models + validation", () => {
    const models = new Array(MODEL_COUNT);
    for (let i = 0; i < MODEL_COUNT; i++) {
      models[i] = createValidationModel();
    }
    for (let i = 0; i < MODEL_COUNT; i++) {
      void models[i].service.validation;
    }
  });
});
