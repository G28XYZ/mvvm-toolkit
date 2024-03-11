import React from 'react';
import invariant from 'tiny-invariant';
import { Service } from 'typedi';
import { ReactComponent, VMProps } from '../view';
import { state } from '../store';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const ReactMemoSymbol = hasSymbol
  ? Symbol.for('react.memo')
  : typeof React.memo === 'function' && React.memo((props: any) => null)['$$typeof'];

export const ApplyViewModel = <V extends VMProps>(
  fc: React.FC<V> & { $$typeof?: typeof ReactMemoSymbol; type?: (...args: any[]) => any }
) => {
  return <T extends new (...args: any[]) => any>(base: T): T => {
    invariant(fc);
    const baseName = base.name || Object.getPrototypeOf(base).name;

    Service(baseName)(
      class extends base {
        constructor(...args: any[]) {
          super(...args);
          if (args.length && args[0].services) {
            state.storeServices = args[0].services;
          }
        }
      }
    );

    if (!base.toString().includes('makeObservable')) {
      throw new Error(`[mvvm-toolkit] add 'makeObservable' from 'mobx' in class constructor or method in '${baseName}'`);
    }

    if (ReactMemoSymbol && !(fc['$$typeof'] === ReactMemoSymbol)) {
      throw new Error('[mvvm-toolkit] wrap ' + (fc.name || fc.displayName) + " FC to 'observer' from 'mobx-react-lite' or 'mobx-react'");
    }

    const origin = fc.type;

    fc.type = ReactComponent(origin, baseName);

    return base;
  };
};
