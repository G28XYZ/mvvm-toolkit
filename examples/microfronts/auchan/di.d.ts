import type { AppServices as Mf5kaServices, AppStores as Mf5kaStores } from '5ka-microfront';
import type { AppServices as HostServices } from 'microfronts-host';
import type { AppServices } from "./src/app/container";
import type { AppStores } from "./src/app/container";

declare module "rvm-toolkit" {
  interface DiServices extends AppServices {}
  interface DiServices extends DiServices, Mf5kaServices, HostServices {}

  interface DiStores extends AppStores, Mf5kaStores {}
}
