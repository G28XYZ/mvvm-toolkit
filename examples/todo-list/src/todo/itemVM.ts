import { action, computed, observable } from "mobx";
import { Inject, InjectStore, type InjectStoreType, type InjectType, MakeObservable, PropFromView, Service, ViewModel } from "rvm-toolkit";
import { TodoModel } from "./model";
import type { Todo } from "./types";

@Service({ id: 'ItemVM', transient: true })
@MakeObservable
export class ItemVM extends ViewModel {
  @InjectStore("TodoStore") store : InjectStoreType<"TodoStore">;
  @Inject ('TodoVM')        parent: InjectType<'TodoVM'>;

  @PropFromView('item') item: Todo;

  @observable isEditing: boolean = false;

  @action.bound toggle(todo: TodoModel) {
    this.store.toggle(todo);
  }

  @action.bound remove(todo: TodoModel) {
    this.store.removeTodo(todo);
  }

  @action.bound setIsEditing() {
    this.isEditing = true;
  }

  @action updateText(todo: Todo, text: string) {
    todo.text = text;
  }

  @action.bound onSave() {
    if(this.errors.text) return;
    this.isEditing = false;
  }

  @action.bound onCommit() {
    this.isEditing = false;
    this.item.service.commit();
    console.log(this.item.service.dumpData);
    console.log(this.item);

  }

  @action.bound onCancel() {
    this.isEditing = false;
    this.item.service?.reject();
  }

  @computed get errors() {
    return this.item.service?.validation;
  }

}