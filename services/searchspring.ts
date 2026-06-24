import { SearchResponse } from "../types";

export interface SearchParams {
  q?: string;
  page?: number;
  sort?: string;
  filters?: Record<string, string | string[]>;
}

const SITE_ID = "scmq7n";
const BASE_URL = "https://api.searchspring.net/api/search/search.json";

export async function searchProducts(
  params: SearchParams,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = new URL(BASE_URL);
  
  url.searchParams.append("siteId", SITE_ID);
  url.searchParams.append("resultsFormat", "native");
  
  if (params.q) {
    url.searchParams.append("q", params.q);
  }
  
  if (params.page) {
    url.searchParams.append("page", params.page.toString());
  }
  
  // Example sorting: "price-desc" -> "sort.price=desc"
  if (params.sort) {
    const [field, direction] = params.sort.split("-");
    if (field && direction) {
      url.searchParams.append(`sort.${field}`, direction);
    }
  }
  
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`filter.${key}`, v));
      } else {
        url.searchParams.append(`filter.${key}`, value as string);
      }
    });
  }

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data: SearchResponse = await response.json();
  return data;
}
