import { StoreBase, Store } from "rvm-toolkit";
import { servicePrefix } from "./utils";
import { ProductModel } from "./model";

@Store({ id: `${servicePrefix}:Store` })
export class AuchanStore extends StoreBase<ProductModel> {
  
}