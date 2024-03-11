import React, { FC, createContext, useContext, useEffect } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { state } from '../store';

export type VMProps<T = any> = { viewModel?: T };

const VmContext = createContext(null);

const useVmContext = () => useContext(VmContext);

export abstract class ViewModel<T = any> {
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
}

export const ReactComponent = (fc: FC, vmName: string) => {
  const viewModel = state.getService(vmName);

  return (props: VMProps, ref: any) => {
    const vmNameCtx = useVmContext();

    useEffect(() => {
      viewModel['parentCtxName'] = vmNameCtx;
      viewModel['mount']();

      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'viewModel' && key in viewModel) {
          try {
            Object.defineProperty(viewModel, key, {
              value,
            });
          } catch {
            console.warn(`[mvvm-toolkit] can't define field '${key}' in '${vmName}'`);
          }
        }
      });

      return () => viewModel['unmount']();
    }, []);

    const Fc = fc.bind(this, { ...props, viewModel }, ref);

    return (
      <VmContext.Provider value={vmName}>
        <Fc />
      </VmContext.Provider>
    );
  };
};
