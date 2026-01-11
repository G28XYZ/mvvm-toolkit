import { computed, observable } from "mobx";
import { InjectStore, type InjectStoreType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductListVM` })
@MakeObservable
export class ProductListVM extends ViewModel {
  @InjectStore("5ka:ProductStore") store: InjectStoreType<'5ka:ProductStore'>;

  @observable lastQuery = '';

  @observable correction = '';

  @computed get items() {
    return this.store.items || [];
  }

  @computed get resultCount() {
    return this.items.length;
  }

}
