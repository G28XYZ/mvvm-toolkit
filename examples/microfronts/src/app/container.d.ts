import type { AppVM } from "./appVM";

export interface AppServices {
  "mfHost:AppVM": typeof AppVM;
}
