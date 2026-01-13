import { computed, observable } from "mobx";
import { Inject, InjectStore, type InjectStoreType, type InjectType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductListVM` })
@MakeObservable
export class ProductListVM extends ViewModel {
  @Inject('auchan:SearchVM') auchanSearch: InjectType<'auchan:SearchVM'>;
  @InjectStore("5ka:ProductStore") store: InjectStoreType<'5ka:ProductStore'>;

  @computed get correction() {
    return this.auchanSearch?.search.result?.correction;
  }

  @computed get items() {
    return this.store.items || [];
  }

  @computed get resultCount() {
    return this.items.length;
  }

}
