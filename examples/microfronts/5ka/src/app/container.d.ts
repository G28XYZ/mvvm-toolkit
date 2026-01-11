import type { ProductItemVM } from "./itemVM";
import type { ProductListVM } from "./listVM";
import type { SearchVM } from "./searchVM";
import type { ProductVM } from "./vm";
import type { ProductStore } from "./store";
import type { Api } from "./api";

export interface AppServices {
  "5ka:Api": typeof Api;
  "5ka:ProductItemVM": typeof ProductItemVM;
  "5ka:ProductListVM": typeof ProductListVM;
  "5ka:SearchVM": typeof SearchVM;
  "5ka:ProductVM": typeof ProductVM;
}

export interface AppStores {
  "5ka:ProductStore": typeof ProductStore;
}
