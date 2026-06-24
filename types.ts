export interface SearchResponse {
  pagination: Pagination;
  sorting: Sorting;
  resultLayout: string;
  results: Product[];
  facets: Facet[];
}

export interface Pagination {
  totalResults: number;
  begin: number;
  end: number;
  currentPage: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  perPage: number;
  defaultPerPage: number;
}

export interface Sorting {
  options: SortOption[];
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
  label: string;
}

export interface Badge {
  tag: string;
  value: string;
}

export interface FacetValue {
  active?: boolean;
  type: string;
  value: string;
  label: string;
  count: number;
  low?: number;
  high?: number;
}

export interface Facet {
  field: string;
  label: string;
  type: "value" | "range" | "slider";
  collapse: number;
  facet_active: number;
  values: FacetValue[];
}

export interface Product {
  id: string;
  uid: string;
  name: string;
  title?: string;
  brand: string;
  // API returns price/msrp as strings — parse before using
  price: string;
  msrp: string;
  ss_sale_price?: string;
  on_sale?: string[];
  imageUrl: string;
  thumbnailImageUrl: string;
  badges: Badge[];
  color?: string[];
  size?: string[];
  ratingCount?: number;
  quantity_available?: string[];
  url?: string;
  sku?: string;
}