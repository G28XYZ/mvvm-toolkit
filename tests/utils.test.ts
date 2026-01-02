import { describe, expect, it } from "vitest";
import { defineMetadata, getExecutingFunctionNameByStack, getOwnMetadata, isSerializable } from "../src/utils";

describe("utils", () => {
  it("сохраняет и читает metadata", () => {
    const key = Symbol("meta");
    const target = {};

    expect(getOwnMetadata(key, target, [])).toEqual([]);

    defineMetadata(key, { id: 1 }, target);
    expect(getOwnMetadata(key, target)).toEqual({ id: 1 });
  });

  it("проверяет сериализуемость", () => {
    expect(isSerializable({ value: 1 })).toBe(true);

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(isSerializable(circular)).toBe(false);
  });

  it("извлекает имя функции из stack", () => {
    const stack = "Error\n at ignore (file:1:1)\n at targetFunction (file:2:3)\n at next (file:3:4)";
    expect(getExecutingFunctionNameByStack(stack)).toBe("targetFunction (file:2:3)");
  });
});
