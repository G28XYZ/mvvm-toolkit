import type { AppServices } from "./src/app/container";
declare module "rvm-toolkit" {
  interface DiServices extends AppServices {}
}
