import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { searchProducts } from "@/services/searchspring";
import { getActiveFilters } from "@/lib/filters";
import type { SearchResponse, Product } from "@/types";

export function usePlp() {
  const router = useRouter();

  // URL state query parameters managed by nuqs
  const [q] = useQueryState("q", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [sort] = useQueryState("sort", parseAsString.withDefault(""));

  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [lastSort, setLastSort] = useState(sort);

  // Load user preference for infinite scroll on mount
  useEffect(() => {
    const saved = localStorage.getItem("athos_infinite_scroll");
    if (saved) {
      setIsInfiniteScroll(saved === "true");
    }
  }, []);

  const toggleInfiniteScroll = (val: boolean) => {
    setIsInfiniteScroll(val);
    localStorage.setItem("athos_infinite_scroll", String(val));
  };

  // Reset page to 1 on sort change
  useEffect(() => {
    if (sort !== lastSort) {
      setPage(1);
      setLastSort(sort);
    }
  }, [sort, lastSort, setPage]);

  // Dynamic filters parsed from router query (parameters prefixed with "filter.")
  const filters = useMemo(() => {
    if (!router.isReady) return {};
    return getActiveFilters(router.query);
  }, [router.isReady, router.query]);

  // Main search query fetch
  const queryResult = useQuery<SearchResponse>({
    queryKey: ["products", { q, page, sort, filters }],
    queryFn: ({ signal }) =>
      searchProducts(
        {
          q: q || undefined,
          page: page || undefined,
          sort: sort || undefined,
          filters,
        },
        signal
      ),
    enabled: router.isReady, // Wait for next/router to hydrate
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Cache query data as fresh for 5 minutes
    gcTime: 1000 * 60 * 10,   // Keep cache in memory for 10 minutes
  });

  // Keep pagination URL state in sync with the actual API response page.
  // E.g. if page=10 is in the URL, but there are only 6 pages of results,
  // this effect automatically corrects the URL parameter back to 6.
  const apiCurrentPage = queryResult.data?.pagination?.currentPage;
  const apiTotalPages = queryResult.data?.pagination?.totalPages;
  const totalPages = apiTotalPages ?? 1;
  const isPlaceholderData = queryResult.isPlaceholderData;

  useEffect(() => {
    if (!router.isReady) return;
    if (isPlaceholderData) return; // Wait until new data is loaded before syncing/clamping URL

    if (apiCurrentPage !== undefined && apiTotalPages !== undefined) {
      if (apiTotalPages > 0 && page > apiTotalPages) {
        setPage(apiTotalPages);
      } else if (page < 1) {
        setPage(1);
      } else if (apiCurrentPage !== page) {
        setPage(apiCurrentPage);
      }
    }
  }, [router.isReady, apiCurrentPage, apiTotalPages, page, setPage, isPlaceholderData]);

  // Accumulate products for infinite scroll
  useEffect(() => {
    if (!queryResult.data || isPlaceholderData) return;

    const newResults = queryResult.data.results ?? [];
    const currentPage = queryResult.data.pagination?.currentPage ?? 1;

    if (currentPage === 1) {
      setAccumulatedProducts(newResults);
    } else {
      setAccumulatedProducts((prev) => {
        // Avoid duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = newResults.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });
    }
  }, [queryResult.data, q, sort, filters, isPlaceholderData]);

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    refetch: queryResult.refetch,
    q,
    page,
    sort,
    filters,
    isInfiniteScroll,
    toggleInfiniteScroll,
    infiniteProducts: accumulatedProducts,
    hasMore: page < totalPages,
    loadNextPage: () => {
      if (!queryResult.isFetching && page < totalPages) {
        setPage(page + 1);
      }
    },
  };
}
