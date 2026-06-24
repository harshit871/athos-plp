import { useEffect, useRef } from "react";
import SearchBar from "@/components/Plp/Products/SearchBar";
import ProductResults from "@/components/Plp/Products/ProductResults";
import SortDropdown from "@/components/Plp/Products/SortDropdown";
import Pagination from "@/components/Plp/Products/Pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { SearchResponse, Product } from "@/types";

interface ProductsProps {
  data: SearchResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  onOpenFilters: () => void;
  isInfiniteScroll: boolean;
  setIsInfiniteScroll: (val: boolean) => void;
  infiniteProducts: Product[];
  loadNextPage: () => void;
  hasMore: boolean;
}

const Products = ({
  data,
  isLoading,
  isFetching,
  isError,
  refetch,
  onOpenFilters,
  isInfiniteScroll,
  setIsInfiniteScroll,
  infiniteProducts,
  loadNextPage,
  hasMore,
}: ProductsProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInfiniteScroll || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "200px" } // Load next page slightly before reaching the bottom
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isInfiniteScroll, hasMore, isFetching, loadNextPage]);

  const pagination = data?.pagination;
  const totalResults = pagination?.totalResults ?? 0;
  const begin = pagination?.begin ?? 0;
  const end = pagination?.end ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar — search + sort + mobile filter trigger */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchBar />
        </div>

        {!isLoading && !isError && (
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {totalResults > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {begin}–{end} of {totalResults}
              </span>
            )}
            <div className="flex items-center gap-4">
              {/* Infinite Scroll Toggle */}
              <div className="flex items-center gap-2 pr-1 select-none">
                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  Infinite Scroll: <span className={isInfiniteScroll ? "text-primary font-bold" : "text-muted-foreground font-bold"}>{isInfiniteScroll ? "ON" : "OFF"}</span>
                </span>
                <button
                  role="switch"
                  aria-checked={isInfiniteScroll}
                  onClick={() => setIsInfiniteScroll(!isInfiniteScroll)}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isInfiniteScroll 
                      ? "bg-primary border-primary" 
                      : "bg-zinc-200 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
                  }`}
                  aria-label="Toggle Infinite Scroll"
                >
                  <span
                    className={`pointer-events-none block h-4.5 w-4.5 rounded-full bg-background shadow-md transition-transform duration-200 ${
                      isInfiniteScroll ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Only visible below lg breakpoint */}
              <Button
                variant="outline"
                onClick={onOpenFilters}
                className="h-8 gap-1.5 px-3 text-xs lg:hidden"
                aria-label="Open Filters"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
              </Button>
              <SortDropdown />
            </div>
          </div>
        )}
      </div>

      {/*
        Apply a subtle opacity transition while a background refetch runs
        (filter/sort/page change). isLoading is true only on the very first load
        and shows the full skeleton via ProductResults. isFetching covers both.
        In Infinite Scroll mode, we keep the existing cards at full opacity
        and append skeleton loaders at the bottom instead.
      */}
      <div
        className={
          !isInfiniteScroll && isFetching && !isLoading ? "transition-opacity duration-200 opacity-50" : ""
        }
      >
        <ProductResults
          products={isInfiniteScroll ? infiniteProducts : data?.results}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          isInfiniteScroll={isInfiniteScroll}
          isFetching={isFetching}
        />
      </div>

      {isInfiniteScroll && hasMore && !isLoading && !isError && (
        <div ref={loadMoreRef} className="h-10 w-full flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isInfiniteScroll && !isLoading && !isError && <Pagination pagination={pagination} />}
    </div>
  );
};

export default Products;
