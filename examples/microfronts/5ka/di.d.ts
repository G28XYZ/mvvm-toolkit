import type { AppServices } from "./src/app/container";
import type { AppStores } from "./src/app/container";
import type { AppServices as HostAppServices } from "microfronts-host";
import type { AppServices as MfAuchanAppServices } from "auchan-microfront";

declare module "rvm-toolkit" {
  interface DiServices extends AppServices {}

  interface DiServices extends DiServices, HostAppServices, MfAuchanAppServices {}

  interface DiStores extends AppStores {}
}
