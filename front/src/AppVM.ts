import { action, makeObservable, observable } from 'mobx';
import { ApplyDecorators, ApplyViewModel, ViewModel } from 'mvvm-toolkit';
import { App } from './';

@ApplyDecorators([ApplyViewModel(App)])
export class AppVM extends ViewModel {
  @observable count = 0;

  test = '';

  constructor() {
    super();
    makeObservable(this);
  }

  @action setCount(num: number) {
    this.count += num;
  }
}
