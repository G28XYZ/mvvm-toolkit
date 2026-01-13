import type { AppServices } from "./src/app/container";
import type { AppServices as Mf5kaServices } from "5ka-microfront";
import type { AppServices as AuchanServices } from "auchan-microfront";

declare module "rvm-toolkit" {
  interface DiServices extends AppServices {}
  
  interface DiServices extends DiServices, Mf5kaServices, AuchanServices {}
}
