import type { TodoVM } from "./vm";
import type { TodoStore } from "./store";
import type { ListVM } from "./listVM";
import type { ItemVM } from "./itemVM";
import type { InputVM } from "./inputVM";

export interface TodoServices {
  TodoVM: typeof TodoVM;

  ListVM: typeof ListVM;
  ItemVM: typeof ItemVM;
  InputVM: typeof InputVM;}

export interface TodoStores {
  TodoStore: typeof TodoStore;
}
