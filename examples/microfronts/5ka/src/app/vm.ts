import { action, observable } from "mobx";
import { InjectStore, type InjectStoreType, MakeObservable, Service, ViewModel } from "rvm-toolkit";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductVM` })
@MakeObservable
export class ProductVM extends ViewModel {
  @InjectStore('5ka:ProductStore') store: InjectStoreType<'5ka:ProductStore'>;

  // введённое пользователем имя товара
  @observable query: string = "";

  @action.bound setQuery(value: string) {
    this.query = value;
  }

}
