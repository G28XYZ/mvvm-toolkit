import React, { FC, memo, useEffect } from 'react';
import { Container, Service } from 'typedi';
import { action, computed, isObservable, makeObservable } from 'mobx';
import invariant from 'tiny-invariant';
import { observer } from 'mobx-react-lite';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const ReactMemoSymbol = hasSymbol ? Symbol.for('react.memo') : typeof memo === 'function' && memo((props: any) => null)['$$typeof'];

class State {
  #services: ViewModel[] = [];

  constructor() {
    makeObservable(this);
  }

  @computed get storeServices() {
    return this.#services;
  }

  set storeServices(value) {
    this.#services = value;
  }
}

const state = new State();

export type VMProps<T = any> = { viewModel?: T };

export abstract class ViewModel<T = any> {
  constructor() {
    makeObservable(this);
  }

  @action getStore(name?: string) {
    if (name) {
      return state.storeServices.find((item) => 'id' in item && item.id === name).value;
    }
    return state.storeServices.map((item) => 'value' in item && item.value);
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

const Component = (fc: FC, vm: ViewModel | string) => {
  const viewModel = typeof vm === 'object' ? vm : Container.get<ViewModel>(vm);
  return (props: VMProps, ref: any) => {
    useEffect(() => {
      if (!isObservable(viewModel)) {
        makeObservable(viewModel);
      }
      viewModel['mount']();
      return () => {
        viewModel['unmount']();
      };
    }, []);

    const Fc = fc.bind(this, { ...props, viewModel }, ref);

    return <Fc />;
  };
};

export const ApplyViewModel = <V extends VMProps>(fc: FC<V> & { $$typeof?: typeof ReactMemoSymbol; type?: (...args: any[]) => any }) => {
  return <T extends new (...args: any[]) => any>(base: T): T => {
    invariant(fc);
    const baseName = base.name || Object.getPrototypeOf(base).name;
    Service(baseName)(
      class extends base {
        constructor(...args: any[]) {
          super(...args);
          makeObservable(this);

          console.log(1, args);

          fc.defaultProps = { viewModel: this };

          fc = observer(fc);
          console.log(fc);

          const origin = fc.type;

          fc.type = Component(origin, this);

          if (args.length && args[0].services) {
            state.storeServices = args[0].services;
          }
        }
      }
    );

    // if (ReactMemoSymbol && !(fc['$$typeof'] === ReactMemoSymbol)) {
    //   throw new Error(
    //     '[mvvm-toolkit] wrap ' + (fc.name || fc.displayName) + " FC to 'observer' from 'mobx-react-lite', 'React.memo' not applied"
    //   );
    // }

    // console.log((fc = observer(fc)));

    const origin = fc.type;

    fc.type = Component(origin, base.name);

    return base;
  };
};

export const ApplyDecorators = (decorators: Array<(...args: any[]) => any>) => {
  return <T extends new (...args: any[]) => any>(base: T) => {
    const baseName = base.name || Object.getPrototypeOf(base).name;

    const mapDecorator = decorators.map((item) => (base: T) => item(base) || base);

    return mapDecorator.reduce((b, c) => c(base) || base, base);
  };
};
