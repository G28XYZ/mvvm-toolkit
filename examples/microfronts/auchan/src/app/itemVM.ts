import { observable } from "mobx";
import {
  InjectStore,
  type InjectStoreType,
  MakeObservable,
  PropFromView,
  Service,
  ViewModel,
} from "rvm-toolkit";
import type { Product } from "./types";
import { servicePrefix } from "./utils";

@Service({ id: `${servicePrefix}:ProductItemVM`, transient: true })
@MakeObservable
export class ProductItemVM extends ViewModel {
  @InjectStore("auchan:ProductStore") store: InjectStoreType<'auchan:ProductStore'>;

  @PropFromView("item") item: Product;

  @observable isAdded = false

}
