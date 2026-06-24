import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/Plp/Products/SearchBar";
import ProductResults from "@/components/Plp/Products/ProductResults";
import SortDropdown from "@/components/Plp/Products/SortDropdown";
import Pagination from "@/components/Plp/Products/Pagination";
import { Button } from "@/components/ui/button";
import { Filter, LayoutGrid, List } from "lucide-react";
import type { SearchResponse, Product } from "@/types";

interface ProductsProps {
  data: SearchResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNewQuery: boolean;
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
  isFetchingNewQuery,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const saved = localStorage.getItem("athos_view_mode");
    if (saved === "grid" || saved === "list") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("athos_view_mode", mode);
  };

  useEffect(() => {
    if (!isInfiniteScroll || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "200px" },
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar />
        </div>

        {!isLoading && !isError && (
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {totalResults > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {begin}–{end} of {totalResults}
              </span>
            )}
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
              <div className="flex items-center gap-2 pr-1 select-none">
                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  Infinite Scroll
                </span>
                <button
                  role="switch"
                  aria-checked={isInfiniteScroll}
                  onClick={() => setIsInfiniteScroll(!isInfiniteScroll)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isInfiniteScroll
                      ? "bg-green-200 border-primary shadow-sm"
                      : "bg-muted border-border hover:bg-muted/80"
                  }`}
                  aria-label="Toggle Infinite Scroll"
                >
                  <span
                    className={`pointer-events-none block h-4.5 w-4.5 rounded-full shadow-md transition-all duration-200 ${
                      isInfiniteScroll
                        ? "translate-x-5 bg-green-500"
                        : "translate-x-0.5 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              <div className="hidden sm:flex bg-muted p-0.5 rounded-lg border border-border items-center">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${
                    viewMode === "grid"
                      ? "bg-green-300 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`p-1.5 rounded-md cursor-pointer transition-all ${
                    viewMode === "list"
                      ? "bg-green-300 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                  aria-label="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

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

      <div className="">
        <ProductResults
          products={isInfiniteScroll ? infiniteProducts : data?.results}
          isLoading={isLoading || isFetchingNewQuery || (isFetching && !isInfiniteScroll)}
          isError={isError}
          refetch={refetch}
          isInfiniteScroll={isInfiniteScroll}
          isFetching={isFetching}
          viewMode={viewMode}
        />
      </div>

      {isInfiniteScroll && hasMore && !isLoading && !isError && (
        <div
          ref={loadMoreRef}
          className="h-10 w-full flex items-center justify-center py-4"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isInfiniteScroll && !isLoading && !isError && (
        <Pagination pagination={pagination} />
      )}
    </div>
  );
};

export default Products;
