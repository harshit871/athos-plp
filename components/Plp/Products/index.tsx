import SearchBar from "@/components/Plp/Products/SearchBar";
import ProductResults from "@/components/Plp/Products/ProductResults";
import SortDropdown from "@/components/Plp/Products/SortDropdown";
import Pagination from "@/components/Plp/Products/Pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { SearchResponse } from "@/types";

interface ProductsProps {
  data: SearchResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  onOpenFilters: () => void;
}

const Products = ({
  data,
  isLoading,
  isFetching,
  isError,
  refetch,
  onOpenFilters,
}: ProductsProps) => {
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
            <div className="flex items-center gap-2">
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
      */}
      <div
        className={
          isFetching && !isLoading ? "transition-opacity duration-200 opacity-50" : ""
        }
      >
        <ProductResults
          products={data?.results}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
        />
      </div>

      {!isLoading && !isError && <Pagination pagination={pagination} />}
    </div>
  );
};

export default Products;
