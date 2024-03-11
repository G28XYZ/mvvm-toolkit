import { computed, makeObservable } from 'mobx';
import { ViewModel } from '../view';

class State {
  private _services: ViewModel[] = [];

  constructor() {
    makeObservable(this);
  }

  @computed get storeServices() {
    return this._services;
  }

  set storeServices(value) {
    this._services = value;
  }
}

export const state = new State();
