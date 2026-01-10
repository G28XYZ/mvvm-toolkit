export type DigineticaCategory = {
  id: string;
  name: string;
  direct: boolean;
  link_url?: string;
  image_url?: string;
};

export type DigineticaSku = {
  id: string;
  available: boolean;
  name: string;
  price: string;
  oldPrice?: string;
  link_url?: string;
  image_url?: string;
  image_urls?: string[];
  attributes?: Record<string, string[]>;
};

export type DigineticaProduct = {
  id: string;
  groupId: string;
  available: boolean;
  name: string;
  brand?: string;
  price: string;
  oldPrice?: string;
  score?: number;
  link_url?: string;
  image_url?: string;
  image_urls?: string[];
  categories?: DigineticaCategory[];
  attributes?: Record<string, string[]>;
  skus?: DigineticaSku[];
};

export type DigineticaSearchResponse = {
  query: string;
  correction?: string;
  totalHits: number;
  zeroQueries?: boolean;
  products: DigineticaProduct[];
  // facets/selectedFacets можно добавить при необходимости
};