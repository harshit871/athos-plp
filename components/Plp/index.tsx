import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import { usePlp } from "@/hooks/use-plp";
import Filters from "@/components/Plp/Filters";
import Products from "@/components/Plp/Products";
import Header from "@/components/Plp/Header";

const Plp = () => {
  const router = useRouter();
  const { data, isLoading, isFetching, isError, refetch, filters } = usePlp();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Close the mobile drawer whenever a shallow navigation completes (filter click)
  useEffect(() => {
    const handleRouteChange = () => setIsMobileFiltersOpen(false);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />

      <div className="flex flex-1 w-full">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:block" aria-label="Filters Sidebar">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
            {/*
              Pass isLoading (first-load only) to Filters — the skeleton shows only
              when there are no cached facets yet. During refetches the sidebar
              stays intact so accordion state is preserved.
            */}
            <Filters
              facets={data?.facets ?? []}
              isLoading={isLoading}
              activeFilters={filters}
            />
          </div>
        </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {/*
          isFetching covers both first-load and background refetches.
          isLoading is true only when there is no cached data at all.
          Products uses isFetching for a subtle opacity transition on the grid
          so the skeleton shows only on the very first render.
        */}
        <Products
          data={data}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          refetch={refetch}
          onOpenFilters={() => setIsMobileFiltersOpen(true)}
        />
      </main>
      </div>

      {/* Mobile filter drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-in panel */}
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <Filters
                facets={data?.facets ?? []}
                isLoading={isLoading}
                activeFilters={filters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plp;
