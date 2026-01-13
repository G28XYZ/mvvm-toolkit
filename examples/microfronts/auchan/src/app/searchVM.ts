import { action, observable, computed } from "mobx";
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
} from "rvm-toolkit";
import { servicePrefix } from "./utils";


@Service({ id: `${servicePrefix}:SearchVM` })
@MakeObservable
export class SearchVM extends ViewModel {
  @InjectStore("auchan:ProductStore") store: InjectStoreType<"auchan:ProductStore">;

  // родительская VM хранит query, чтобы его можно было показывать/использовать на экране
  @Inject("auchan:ProductVM") parent: InjectType<"auchan:ProductVM">;

  @Inject("auchan:Api") api: InjectType<'auchan:Api'>;

  private externalDisposers: Array<() => void> = [];

  private async *_search() {
    await this.store.search(this.parent.query);
  }

  search = flowCommand(() => this._search(), {
    canExecute: ({ state, states }) => this.parent.query.trim().length > 0 && state === states.ready,
  });

  @action.bound updateQuery(value: string) {
    this.parent.setQuery(value);
  }

  @computed get hasExternalSearch() {
    return GetService('mfHost:AppVM', 'instance');
  }

  @action.bound clear() {
    this.parent.setQuery("");
  }

  onInit() {
    const searchVM5ka = GetService('5ka:SearchVM', 'instance');

    console.log(searchVM5ka);

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
        this.search.execute();
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
