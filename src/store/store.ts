import { action, computed, makeObservable } from 'mobx';
import { ViewModel } from '../view';

class State {
  private _services: (ViewModel & Partial<{ value: ViewModel }>)[] = [];

  constructor() {
    makeObservable(this);
  }

  @action getService(nameService: string) {
    return this._services.find((item) => 'id' in item && item.id === nameService)?.value;
  }

  @computed get storeServices() {
    return this._services;
  }

  set storeServices(value) {
    this._services = value;
  }
}

export const state = new State();
