import { makeObservable, observable } from 'mobx';
import { ApplyDecorators, ApplyViewModel, ViewModel } from 'mvvm-toolkit';
import { Test } from './';

@ApplyDecorators([ApplyViewModel(Test)])
export class TestVM extends ViewModel {
  @observable test = 'Test';

  constructor() {
    super();
    makeObservable(this);
  }
}
