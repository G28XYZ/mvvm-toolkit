import React, { FC, createContext, useContext, useEffect } from 'react';
import { Container } from 'typedi';
import { action, computed, makeObservable } from 'mobx';
import { state } from '../store';

export type VMProps<T = any> = { viewModel?: T };

const VmContext = createContext(null);

const useVmContext = () => useContext(VmContext);

export abstract class ViewModel<T = any> {
  private parentVmName: string;

  constructor() {
    makeObservable(this);
  }

  @computed get parent() {
    return this.parentVmName ? (this.getStore(this.parentVmName) as T) : null;
  }

  @action getStore(name?: string) {
    try {
      if (name) {
        const store = state.storeServices.find((item) => 'id' in item && item.id === name);
        return (store && 'value' in store && store.value) || store;
      }
      return state.storeServices.map((item) => 'value' in item && item.value);
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

export const ReactComponent = (fc: FC, vm: string) => {
  return (props: VMProps, ref: any) => {
    const viewModel = Container.get<ViewModel>(vm);

    const vmName = useVmContext();

    useEffect(() => {
      viewModel['parentVmName'] = vmName;
      viewModel['mount']();

      Object.entries(props).forEach(([key, value]) => {
        if (key !== 'viewModel' && key in viewModel) {
          try {
            Object.defineProperty(viewModel, key, {
              value,
            });
          } catch {
            console.warn(`[mvvm-toolkit] can not define field '${key}' in '${vm}'`);
          }
        }
      });

      return () => viewModel['unmount']();
    }, []);

    const Fc = fc.bind(this, { ...props, viewModel }, ref);

    return (
      <VmContext.Provider value={vm}>
        <Fc />
      </VmContext.Provider>
    );
  };
};
