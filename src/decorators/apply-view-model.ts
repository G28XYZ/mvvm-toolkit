import React from 'react';
import invariant from 'tiny-invariant';
import { ServiceOptions } from 'typedi';
import { ReactComponent, VMProps, ViewModel } from '../view';
import { SetService } from '.';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const ReactMemoSymbol = hasSymbol
  ? Symbol.for('react.memo')
  : typeof React.memo === 'function' && React.memo((props: any) => null)['$$typeof'];

export const ApplyViewModel = <V extends VMProps>(
  fc: React.FC<V> & { $$typeof?: typeof ReactMemoSymbol; type?: (...args: any[]) => any },
  serviceOptions?: ServiceOptions<unknown>
) => {
  return <T extends (new (...args: any[]) => any) & Partial<typeof ViewModel>>(base: T): T => {
    invariant(fc);
    const baseName = base.name || Object.getPrototypeOf(base).name;

    SetService({ eager: true, ...serviceOptions, id: baseName })(base);

    // if (!base.toString().includes('makeObservable')) {
    //   throw new Error(`[mvvm-toolkit] add 'makeObservable' from 'mobx' in class constructor or method in '${baseName}'`);
    // }

    if (ReactMemoSymbol && !(fc['$$typeof'] === ReactMemoSymbol)) {
      throw new Error('[mvvm-toolkit] wrap ' + (fc.name || fc.displayName) + " FC to 'observer' from 'mobx-react-lite' or 'mobx-react'");
    }

    const origin = fc.type;

    fc.type = ReactComponent(origin, baseName);

    return base;
  };
};
