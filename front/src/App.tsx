import { FC, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { observer } from 'mobx-react-lite';
import { AppVM } from './AppVM';
import { VMProps } from 'mvvm-toolkit';
import invariant from 'tiny-invariant';
import { TestVM } from './TestVM';

interface AppProps extends VMProps<AppVM> {
  test: string;
}

export const App: FC<AppProps> = observer(({ viewModel: vm }) => {
  invariant(vm);
  console.log(vm);

  return (
    <>
      <div>
        <a
          href="https://vitejs.dev"
          target="_blank">
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank">
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => vm?.setCount(1)}>count is {vm?.count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Test />
    </>
  );
});

export const Test: FC<VMProps<TestVM>> = observer(({ viewModel: vm }) => {
  invariant(vm);
  console.log('Test', vm);
  return <>{vm.test}</>;
});
