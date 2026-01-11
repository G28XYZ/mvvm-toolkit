import type { ProductItemVM } from "./itemVM";
import type { ProductListVM } from "./listVM";
import type { SearchVM } from "./searchVM";
import type { ProductVM } from "./vm";
import type { ProductStore } from "./store";
import type { Api } from "./api";

export interface AppServices {
  "auchan:ProductListVM": typeof ProductListVM;
  "auchan:Api": typeof Api;
  "auchan:SearchVM": typeof SearchVM;
  "auchan:ProductItemVM": typeof ProductItemVM;
  "auchan:ProductVM": typeof ProductVM;
}

export interface AppStores {
  "auchan:ProductStore": typeof ProductStore;
}
