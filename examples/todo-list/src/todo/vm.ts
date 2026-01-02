import { action, observable } from "mobx";
import { InjectStore, type InjectStoreType, MakeObservable, Service, ViewModel } from "mvvm-toolkit";
import { TodoModel } from "./model";
import { TodoFilter, type TodoFilterType } from "./types";

@Service
@MakeObservable
export class TodoVM extends ViewModel {
  @InjectStore("TodoStore") store: InjectStoreType<"TodoStore">;

  @observable draft = "";

  @observable todoFilter: TodoFilterType = TodoFilter.All;

	filters = [
		{ id: TodoFilter.All, label: "All" },
		{ id: TodoFilter.Active, label: "Active" },
		{ id: TodoFilter.Done, label: "Done" },
	] as const

  @action.bound setFilter(filter: TodoFilter) {
    this.todoFilter = filter;
  }

  @action.bound clearCompleted() {
    this.store.clearCompleted();
  }

  @action.bound commit(todo: TodoModel) {
    todo.service.commit();
  }

  @action.bound reject(todo: TodoModel) {
    todo.service.reject();
  }
}
