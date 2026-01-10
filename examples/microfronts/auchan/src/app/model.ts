import { Model, field } from "rvm-toolkit";
import { DigineticaCategory, DigineticaProduct, DigineticaSku } from "./types";

export class ProductModel extends Model<DigineticaProduct> {
  @field.noObserve
  id: string = "";

  @field.noObserve
  groupId: string = "";

  @field
  available = false;

  @field
  name = "";

  @field
  brand?: string;

  @field
  price = "";

  @field
  oldPrice?: string;

  @field
  score?: number;

  @field
  link_url?: string;

  @field
  image_url?: string;

  @field
  image_urls?: string[];

  @field
  categories?: DigineticaCategory[];

  @field
  attributes?: Record<string, string[]>;

  @field
  skus?: DigineticaSku[];
}
