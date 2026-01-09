import { computed, action } from "mobx";
import { Inject, InjectStore, type InjectStoreType, type InjectType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { TodoFilter } from "./types";

@Service
@MakeObservable
export class ListVM extends ViewModel {
  @InjectStore("TodoStore") store: InjectStoreType<"TodoStore">;
  @Inject('TodoVM') parent: InjectType<'TodoVM'>;

  onInit() {
    if (this.store.items.length > 0) return;
    this.store.addTodo("Buy a mac 💻");
    this.store.addTodo("Pick up the kids 👶");
    this.store.addTodo("Deep code 🧑‍💻");
    this.store.addTodo("Order sushi 🍤");
    this.store.addTodo("Email David 📨");
    this.store.items[1].done = true;
    this.store.items[4].done = true;

    this.store.addTodos(Array.from({ length: 100_000 }, (_, i) => `Todo ${i}`));

    setTimeout(() => {
      console.log(this.store.items.map(item => item.service.dumpData)); 
    }, 2000)
  }

  @computed get items() {
    return this.visibleItems;
  }

  @computed get remaining() {
    return this.store.remaining;
  }

  @computed get completed() {
    return this.store.completed;
  }

  @action.bound setDraft(value: string) {
    this.parent.draft = value;
  }

  @computed get visibleItems() {
    if (this.parent.todoFilter === TodoFilter.Active) return this.store.filter((item) => !item.done);
    if (this.parent.todoFilter === TodoFilter.Done) return this.store.filter((item) => item.done);
    return this.store.items;
  }
}
