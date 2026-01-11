export type FiveKaImageLinks = {
  small?: string[];
  normal?: string[];
};

export type FiveKaRating = {
  rating_average: number;
  rates_count: number;
} | null;

export type FiveKaPrice = {
  regular: string | null;
  discount: string | null;
  cpd_promo_price: string | null;
};

export type FiveKaLabel = {
  label: string;
  icon_url: string | null;
  bg_color: string;
  text_color: string;
};

export type FiveKaCategory = {
  id: string;
  type: string;
  name: string;
  parent_name?: string;
};

export type FiveKaProduct = {
  plu: number;
  name: string;
  image_links?: FiveKaImageLinks;
  uom?: string;
  step?: string;
  rating?: FiveKaRating;
  promo?: unknown | null;
  prices?: FiveKaPrice;
  labels?: FiveKaLabel[] | null;
  property_clarification?: string;
  has_age_restriction?: boolean;
  stock_limit?: string;
  product_advert?: unknown | null;
  is_large_card?: boolean | null;
  boost_type?: string | null;
  badges?: unknown[];
  initial_weight_step?: string;
  min_weight?: string;
  orange_loyalty_points?: number;
  is_available?: boolean;
  price_piece_unit?: string | null;
};

export type FiveKaSearchResponse = {
  search_query_id: string;
  query_type: string;
  products: FiveKaProduct[];
  categories?: FiveKaCategory[];
};

export type Product = FiveKaProduct;
export type ProductId = FiveKaProduct["plu"];
