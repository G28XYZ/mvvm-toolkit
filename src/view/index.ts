import { observer } from "mobx-react";
import { GetService } from "../typedi";
import type { DiServices, InjectType } from "../typedi";
import { defineMetadata, TInstance } from "../utils";
import { PropFromViewMetadata } from "../model/data";
import { ReactElement, isValidElement, useEffect, useMemo } from "react";

const propFromViewMetadata = new PropFromViewMetadata();

const isDomNode = (value: unknown): boolean => {
  return typeof Node !== "undefined" && value instanceof Node;
};

const isPropFromViewValueAllowed = (value: unknown): boolean => {
  if (value == null) return true;

  const valueType = typeof value;
  if (valueType === "function") return false;
  if (valueType !== "object") return true;

  if (isValidElement(value)) return false;
  return !isDomNode(value);
};

const assertPropFromViewValue = (prop: string, value: unknown) => {
  if (!isPropFromViewValueAllowed(value)) {
    throw new TypeError(
      `PropFromView only accepts object or primitive values; functions, React elements, and DOM nodes are not allowed for prop "${prop}".`
    );
  }
};

/** Тип пропсов для view-обертки. */
type Props<T extends TInstance, U, P extends "Partial" = undefined> = U &
  (P extends "Partial" ? { viewModel?: InstanceType<T> } : { viewModel: InstanceType<T> });

type ViewPropsByKey<K extends keyof DiServices, U> = U & { viewModel?: InjectType<K> };
type ViewPropsByClass<T extends TInstance, U> = U & { viewModel?: InstanceType<T> };

/**
 * Обертка над компонентом с инстансом ViewModel.
 */
export function view<K extends keyof DiServices, U = {}>(
  vm: K,
  reactComponent: (props: ViewPropsByKey<K, U>) => ReactElement
): (props?: U & { viewModel?: InjectType<K> }) => ReactElement;
export function view<T extends TInstance, U = {}>(
  vm: T,
  reactComponent: (props: ViewPropsByClass<T, U>) => ReactElement
): (props?: U & { viewModel?: InstanceType<T> }) => ReactElement;
export function view<U, T extends TInstance = TInstance>(
  vm: T | string,
  reactComponent: (props?: Props<T, U>) => ReactElement
) {
  return observer((props: Props<T, U, 'Partial'> = {} as any) => {
    const { resolved, instance } = useMemo(() => {
      const service = typeof vm === "string" ? GetService(vm) : GetService(vm);
      const resolved = service || (typeof vm !== "string" ? { instance: new vm() } : undefined);
      const instance = resolved?.instance;
      return { resolved, instance };
    }, [vm]);

    useEffect(() => {
      if (!instance) return;
      if (typeof instance.onInit === "function") instance.onInit();
      return () => {
        if (typeof instance.onDispose === "function") instance.onDispose();
      };
    }, [instance]);

    if (resolved) {
      const propsFromView = propFromViewMetadata.fields(instance);
      const resolvedPropsFromView =
        propsFromView.length > 0 ? propsFromView : propFromViewMetadata.fields(Object.getPrototypeOf(instance));
      for (const prop in props) {
        if (resolvedPropsFromView instanceof Array) {
          const propMetadata = resolvedPropsFromView.find((item) => item.name === prop);
          if (propMetadata) {
            const propValue = Reflect.get(props, prop);
            assertPropFromViewValue(prop, propValue);
            Reflect.set(instance, propMetadata.originName, propValue);
          }
        }
      }
      defineMetadata(propFromViewMetadata.metadataKey, resolvedPropsFromView, instance);
      return reactComponent({ viewModel: instance, ...props });
    }

    return reactComponent({ ...props } as any);
  });
}

export * from './types';
