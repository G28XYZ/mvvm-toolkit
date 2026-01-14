import { action, computed, observable } from "mobx";
import {
  Inject,
  InjectStore,
  type InjectStoreType,
  type InjectType,
  flowCommand,
  MakeObservable,
  Service,
  ViewModel,
  GetService,
  asyncCommand,
} from "rvm-toolkit";
import { servicePrefix } from "./utils";
@Service({ id: `${servicePrefix}:SearchVM` })
@MakeObservable
export class SearchVM extends ViewModel {
  @InjectStore("5ka:ProductStore") store: InjectStoreType<"5ka:ProductStore">;

  // родительская VM хранит query, чтобы его можно было показывать/использовать на экране
  @Inject("5ka:ProductVM") parent: InjectType<"5ka:ProductVM">;

  @Inject("5ka:Api") api: InjectType<'5ka:Api'>;

  @observable lastQuery = '';

  @computed get hasExternalSearch() {
    return GetService('mfHost:AppVM', 'instance');
  }

  private externalDisposers: Array<() => void> = [];

  private async _search(test: string) {
    this.lastQuery = this.parent.query;
    return await this.store.search(this.parent.query);
  }

  search = asyncCommand((test: boolean) => this._search(''));

  @action.bound updateQuery(value: string) {
    this.parent.setQuery(value);
  }

  @action.bound clear() {
    this.parent.setQuery("");
  }

  onInit() {
    const bridge = this.hasExternalSearch;
    if (!bridge) return;

    this.parent.setQuery(bridge.getQuery());

    this.externalDisposers.push(
      bridge.onQuery((value) => {
        this.parent.setQuery(value);
      })
    );

    this.externalDisposers.push(
      bridge.onSubmit(() => {
        const t: boolean = true;
        this.search.execute(t);
      })
    );
  }

  onDispose() {
    for (const dispose of this.externalDisposers) {
      dispose();
    }
    this.externalDisposers = [];
  }
}
