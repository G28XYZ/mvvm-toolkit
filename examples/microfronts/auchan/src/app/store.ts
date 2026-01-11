import { Inject, type InjectType, Store, StoreBase } from "rvm-toolkit";
import { ProductModel } from './model';
import { servicePrefix } from "./utils";

@Store({ id: `${servicePrefix}:ProductStore` })
export class ProductStore extends StoreBase(ProductModel) {
  @Inject('auchan:Api') api: InjectType<'auchan:Api'>;

  async search(query: string) {
    const res = await this.api.simpleSearch(query);
    res?.products && this.applyLoaded(res.products);
  }

}
