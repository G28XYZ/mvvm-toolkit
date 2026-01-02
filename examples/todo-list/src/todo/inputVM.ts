import { action, computed, observable } from "mobx";
import { GetStore, MakeObservable, Service, ViewModel } from "mvvm-tools";

@Service
@MakeObservable
export class InputVM extends ViewModel {

	@observable draft: string = '';

	@computed get store() {
		return GetStore('TodoStore');
	}

	@action.bound addTodo() {
		const value = this.draft.trim();
		if (!value) return;
		this.store.addTodo(value);
		this.draft = "";
	}

	@action.bound updateText(value: string) {
		this.draft = value;
	}
}