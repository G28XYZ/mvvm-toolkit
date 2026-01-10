import { InjectStore, type InjectStoreType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";
import { computed, observable } from "mobx";
import { simpleGetProducts } from "./api";


@Service({ id: `${servicePrefix}:SearchVM` })
@MakeObservable
export class SearchVM extends ViewModel {
  @InjectStore(`${servicePrefix}:Store`) store: InjectStoreType<'auchan:Store'>;

  @observable loading = false;

  @observable query = 'хлеб';

  onInit(): void | Promise<void> {
    simpleGetProducts(this.query)
  }

  @computed get products() {
    return this.store.items;
  }
}