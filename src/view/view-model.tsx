import React, { FC, Profiler, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { action, computed, isObservable, makeObservable, observable } from 'mobx';
import { state } from '../store';

export type VMProps<T = any> = { viewModel?: T };

const VmContext = createContext(null);

const useVmContext = () => useContext(VmContext);

export abstract class ViewModel<T extends object = any> {
  @observable isLogProfile = false;

  constructor(private parentCtxName: string = null) {
    makeObservable(this);
  }

  @computed get parentCtx(): T {
    return this.parentCtxName ? this.getStore(this.parentCtxName) : null;
  }

  @action getStore<T = any>(name?: string) {
    try {
      if (name) {
        const store = state.storeServices.find((item) => 'id' in item && item.id === name)?.value;
        return store as T;
      }
      return state.storeServices.map((item) => item.value) as T;
    } catch {}
  }

  private mount() {
    console.log('mount');
    this.onMount();
  }

  protected onMount() {}

  private unmount() {
    console.log('unmount');
    this.onUnmount();
  }

  protected onUnmount() {}

  getHandler(...[target, key, receiver]: Parameters<ProxyHandler<T>['get']>) {
    return Reflect.get(target, key, receiver);
  }

  setHandler(...[target, key, newValue, receiver]: Parameters<ProxyHandler<T>['set']>) {
    return Reflect.set(target, key, newValue, receiver);
  }

  @action.bound onRenderProfile(...args: any[]) {
    this.isLogProfile && console.log(args);
  }
}

const viewModelToProps = (vmName: string, props: any) => {
  const _state = state.getService(vmName);

  const { getHandler: get, setHandler: set } = _state || {};

  const viewModel = new Proxy(_state, {
    get,
    set,
  });

  props = new Proxy(
    { ...props, viewModel },
    {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    }
  );

  Object.entries(props).forEach(([key, value]) => {
    if (key !== 'viewModel' && key in props.viewModel) {
      try {
        Object.defineProperty(props.viewModel, key, {
          value,
        });
      } catch {
        console.warn(`[mvvm-toolkit] can't define field '${key}' in '${vmName}'`);
      }
    }
  });

  return props;
};

export const ReactComponent = (fc: FC, vmName: string) => {
  return (props: VMProps<ViewModel>, ref: any) => {
    const parentCtxName = useVmContext();

    props = useMemo(() => viewModelToProps(vmName, props), []);

    useEffect(() => {
      props.viewModel['parentCtxName'] = parentCtxName;
      props.viewModel['mount']();

      return () => props.viewModel['unmount']();
    }, []);

    const Fc = fc.bind(this, props, ref);

    return (
      <Profiler
        id={`${vmName}-FC`}
        onRender={props.viewModel.onRenderProfile}>
        <VmContext.Provider value={vmName}>
          <Fc />
        </VmContext.Provider>
      </Profiler>
    );
  };
};
