import { Model, field } from "rvm-toolkit";
import type {
  FiveKaImageLinks,
  FiveKaLabel,
  FiveKaPrice,
  FiveKaProduct,
  FiveKaRating,
} from "./types";

export class ProductModel extends Model<FiveKaProduct> {
  @field.noObserve
  plu = 0;

  @field
  name = "";

  @field
  image_links?: FiveKaImageLinks;

  @field
  uom?: string;

  @field
  step?: string;

  @field
  rating?: FiveKaRating;

  @field
  promo?: unknown | null;

  @field
  prices?: FiveKaPrice;

  @field
  labels?: FiveKaLabel[] | null;

  @field
  property_clarification?: string;

  @field
  has_age_restriction?: boolean;

  @field
  stock_limit?: string;

  @field
  product_advert?: unknown | null;

  @field
  is_large_card?: boolean | null;

  @field
  boost_type?: string | null;

  @field
  badges?: unknown[];

  @field
  initial_weight_step?: string;

  @field
  min_weight?: string;

  @field
  orange_loyalty_points?: number;

  @field
  is_available?: boolean;

  @field
  price_piece_unit?: string | null;
}
