import { action, computed } from "mobx";
import { Store, StoreBase } from "mvvm-toolkit";
import { TodoModel } from "./model";

@Store
export class TodoStore extends StoreBase<TodoModel> {

  private nextId = 1;

  @computed get remaining() {
    let count = 0;
    for (const todo of this.items) {
      if (!todo.done) count += 1;
    }
    return count;
  }

  @computed get completed() {
    let count = 0;
    for (const todo of this.items) {
      if (todo.done) count += 1;
    }
    return count;
  }

  @action.bound addTodo(text: string) {
    const todo = new TodoModel({
      id: this.nextId++,
      text,
      done: false,
    });
    this.add(todo);
  }

  @action.bound addTodos(texts: string[]) {
    if (!texts?.length) return;
    const todos = texts.map((text) => new TodoModel({
      id: this.nextId++,
      text,
      done: false,
    }));
    this.addMany(todos);
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
