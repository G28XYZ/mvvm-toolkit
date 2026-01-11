import type { AppServices } from "./src/app/container";
import type { AppStores } from "./src/app/container";
declare module "rvm-toolkit" {
  interface DiServices extends AppServices {}

  interface DiStores extends AppStores {}
}
