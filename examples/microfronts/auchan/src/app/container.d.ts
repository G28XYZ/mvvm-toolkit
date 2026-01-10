import type { AuchanMainVM } from "./vm";
import type { CardVM } from "./cardVM";
import type { SearchVM } from "./searchVM";
import type { AuchanStore } from "./store";

export interface AppServices {
  "auchan:CardVM": typeof CardVM;
  "auchan:SearchVM": typeof SearchVM;
  "auchan:MainVM": typeof AuchanMainVM;
}

export interface AppStores {
  "auchan:Store": typeof AuchanStore;
}
