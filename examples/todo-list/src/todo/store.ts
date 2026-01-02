import { action, computed } from "mobx";
import { Store, StoreBase } from "mvvm-tools";
import { TodoModel } from "./model";

@Store
export class TodoStore extends StoreBase<TodoModel> {

  private nextId = 1;

  @computed get remaining() {
    return this.items.filter((todo) => !todo.done).length;
  }

  @computed get completed() {
    return this.items.filter((todo) => todo.done).length;
  }

  @action.bound addTodo(text: string) {
    const todo = new TodoModel({
      id: this.nextId++,
      text,
      done: false,
    });
    this.add(todo);
  }

  @action.bound toggle(todo: TodoModel) {
    todo.done = !todo.done;
  }

  @action.bound removeTodo(todo: TodoModel) {
    this.remove(todo);
  }

  @action.bound clearCompleted() {
    this.items = this.items.filter((todo) => !todo.done);
  }
}
