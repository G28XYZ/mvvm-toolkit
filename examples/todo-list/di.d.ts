import type { TodoServices } from "./src/todo/container";
import type { TodoStores } from "./src/todo/container";

declare module "rvm-toolkit" {
  interface DiServices extends TodoServices {}
  interface DiStores extends TodoStores {}
}
