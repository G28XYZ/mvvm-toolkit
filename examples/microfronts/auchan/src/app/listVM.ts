import { computed, observable } from "mobx";
import { InjectStore, type InjectStoreType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductListVM` })
@MakeObservable
export class ProductListVM extends ViewModel {
  @InjectStore("auchan:ProductStore") store: InjectStoreType<'auchan:ProductStore'>;

  @observable lastQuery = '';

  @observable correction = '';

  @computed get items() {
    return this.store.items || [];
  }

  @computed get resultCount() {
    return this.items.length;
  }

}
