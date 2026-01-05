import { action, computed, observable } from "mobx";
import { flowCommand, GetStore, MakeObservable, Service, ViewModel } from "mvvm-toolkit";

@Service
@MakeObservable
export class InputVM extends ViewModel {

	@observable draft: string = '';

	@computed get store() {
		return GetStore('TodoStore');
	}

  private async *_addTodo() {
    yield new Promise<number>((res) => setTimeout(() => res(1), 2000));
		const value = this.draft.trim();
		if (!value) return;
    this.store.addTodo(value);
    this.draft = "";
  }

	addTodo = flowCommand(
    () => this._addTodo(),
    {
		  canExecute: ({ state, states }) => this.draft.trim().length > 0 && state === states.ready,
	  }
  );

	@action.bound updateText(value: string) {
		this.draft = value;
	}
}
