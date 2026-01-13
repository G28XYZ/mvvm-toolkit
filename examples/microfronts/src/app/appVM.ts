import { action, observable } from "mobx";
import { MakeObservable, Service, ViewModel } from "rvm-toolkit";

@Service({ id: 'mfHost:AppVM' })
@MakeObservable
export class AppVM extends ViewModel {
  @observable query           = "";
  @observable queryListeners  = new Set<(value: string) => void>();
  @observable submitListeners = new Set<() => void>();

  getQuery = () => this.query;

  @action setQuery = (value: string) => {
    if (value === this.query) return;
    this.query = value;
    for (const listener of this.queryListeners) {
      listener(this.query);
    }
  }

  @action submit = () => {
    for (const listener of this.submitListeners) {
      listener();
    }
  }

  @action onQuery = (listener: (value: string) => void) => {
    this.queryListeners.add(listener);
    return () => {
      this.queryListeners.delete(listener);
    };
  }

  @action onSubmit = (listener: () => void) => {
    this.submitListeners.add(listener);
    return () => {
      this.submitListeners.delete(listener);
    };
  }
}