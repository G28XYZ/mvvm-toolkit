import { computed, observable, when } from "mobx";
import { Inject, InjectStore, type InjectStoreType, type InjectType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductListVM` })
@MakeObservable
export class ProductListVM extends ViewModel {
  @InjectStore("auchan:ProductStore") store: InjectStoreType<'auchan:ProductStore'>;
  @Inject('auchan:SearchVM') searchVM: InjectType<'auchan:SearchVM'>;

  @computed get correction() {
    return this.searchVM?.search.result?.correction;
  }

  @computed get items() {
    return this.store.items || [];
  }

  @computed get resultCount() {
    return this.items.length;
  }

}
