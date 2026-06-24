import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { ChevronDown, ChevronUp, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Facet } from "@/types";

interface FiltersProps {
  facets: Facet[];
  // true only on the very first load — no cached data yet
  isLoading: boolean;
  isFetching: boolean;
  activeFilters: Record<string, string[]>;
}

const DISPLAY_LIMIT = 5;

const Filters = ({ facets, isLoading, isFetching, activeFilters }: FiltersProps) => {
  const router = useRouter();

  // Expand/collapse per facet — all open by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Show-more per facet
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});

  // Per-facet search filter
  const [facetSearch, setFacetSearch] = useState<Record<string, string>>({});

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const hasActiveFilters = useMemo(
    () => Object.keys(activeFilters).length > 0,
    [activeFilters]
  );

  // Read the current raw query as an array, whether Next stored it as string or string[]
  const getQueryArray = (key: string): string[] => {
    const val = router.query[key];
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  // Push updated query keeping existing non-filter params intact
  const pushQuery = (next: Record<string, string | string[] | undefined>) => {
    // Start from only non-filter params + keep q, sort, etc.
    const base: Record<string, string | string[]> = {};
    Object.entries(router.query).forEach(([k, v]) => {
      if (!k.startsWith("filter.") && k !== "page" && v !== undefined) {
        base[k] = v as string | string[];
      }
    });

    // Merge active filters (that weren't removed) back in
    Object.entries(activeFilters).forEach(([k, vals]) => {
      const key = `filter.${k}`;
      if (!(key in next)) {
        // Preserve unchanged filters
        if (vals.length > 0) base[key] = vals.length === 1 ? vals[0] : vals;
      }
    });

    // Apply the new/changed filter params
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || (Array.isArray(v) && v.length === 0)) {
        delete base[k];
      } else {
        base[k] = v;
      }
    });

    router.push({ pathname: router.pathname, query: base }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // Toggle a value-type filter (brand, color, category…)
  const toggleValue = (field: string, value: string) => {
    const key = `filter.${field}`;
    const current = getQueryArray(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    pushQuery({ [key]: next.length > 0 ? next : undefined });
  };

  // Toggle a price-range filter (price.low / price.high)
  const toggleRange = (field: string, low: string, high: string) => {
    const lowKey = `filter.${field}.low`;
    const highKey = `filter.${field}.high`;
    const isActive =
      getQueryArray(lowKey)[0] === low && getQueryArray(highKey)[0] === high;

    if (isActive) {
      pushQuery({ [lowKey]: undefined, [highKey]: undefined });
    } else {
      pushQuery({ [lowKey]: low, [highKey]: high });
    }
  };

  // Clear a single filter pill
  const clearPill = (filterKey: string, value: string) => {
    if (filterKey.endsWith(".low") || filterKey.endsWith(".high")) {
      const base = filterKey.replace(/\.(low|high)$/, "");
      pushQuery({
        [`filter.${base}.low`]: undefined,
        [`filter.${base}.high`]: undefined,
      });
    } else {
      const key = `filter.${filterKey}`;
      const current = getQueryArray(key);
      const next = current.filter((v) => v !== value);
      pushQuery({ [key]: next.length > 0 ? next : undefined });
    }
  };

  // Clear every filter at once
  const clearAll = () => {
    const base: Record<string, string | string[]> = {};
    Object.entries(router.query).forEach(([k, v]) => {
      if (!k.startsWith("filter.") && k !== "page" && v !== undefined) {
        base[k] = v as string | string[];
      }
    });
    router.push({ pathname: router.pathname, query: base }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // ─── Active filter pills ─────────────────────────────────────────────────────
  const pills = useMemo(() => {
    const result: { key: string; value: string; label: string }[] = [];

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (key === "price.low" || key === "price.high") {
        const lo = activeFilters["price.low"]?.[0];
        const hi = activeFilters["price.high"]?.[0];
        if (!result.find((p) => p.key.startsWith("price"))) {
          const label =
            lo && hi ? `Price $${lo}–$${hi}` : lo ? `Price ≥ $${lo}` : `Price ≤ $${hi}`;
          result.push({ key, value: lo ?? hi ?? "", label });
        }
      } else {
        const facet = facets.find((f) => f.field === key);
        const facetLabel = facet?.label ?? key;
        values.forEach((v) =>
          result.push({ key, value: v, label: `${facetLabel}: ${v}` })
        );
      }
    });

    return result;
  }, [activeFilters, facets]);

  // ─── Skeleton — only on very first load (no facets yet) ──────────────────────
  if (isLoading && facets.length === 0) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="space-y-3 border-b border-border py-4">
            <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2">
              {[1, 2, 3].map((m) => (
                <div key={m} className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                  <div
                    className="h-3 animate-pulse rounded-md bg-muted"
                    style={{ width: `${55 + m * 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-0 transition-opacity duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-foreground" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAll}
            className="text-[11px] font-semibold text-primary hover:text-primary/80 px-2 h-6"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active filter pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-4 mb-2 border-b border-border">
          {pills.map((pill) => (
            <button
              key={`${pill.key}-${pill.value}`}
              onClick={() => clearPill(pill.key, pill.value)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 py-1 pl-2.5 pr-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <span>{pill.label}</span>
              <X className="h-3 w-3 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Facet sections */}
      <div className="divide-y divide-border">
        {facets.map((facet) => {
          const isCollapsed = !!collapsed[facet.field];
          const isExpanded = !!showMore[facet.field];
          const search = facetSearch[facet.field] ?? "";

          const matchedValues = facet.values.filter((v) =>
            v.label.toLowerCase().includes(search.toLowerCase())
          );
          const displayedValues = isExpanded
            ? matchedValues
            : matchedValues.slice(0, DISPLAY_LIMIT);
          const hasMore = matchedValues.length > DISPLAY_LIMIT;

          const isCategoryFacet = facet.field.toLowerCase().includes("category");
          const isDisabled = isFetching && isCategoryFacet;

          return (
            <div
              key={facet.field}
              className={`py-4 first:pt-2 transition-opacity duration-200 ${
                isDisabled ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {/* Facet header / toggle */}
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [facet.field]: !prev[facet.field] }))
                }
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                aria-expanded={!isCollapsed}
              >
                <span>{facet.label}</span>
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {!isCollapsed && (
                <div className="mt-3 space-y-2">
                  {/* Search box — only for large facet lists */}
                  {facet.values.length > 10 && (
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={`Search ${facet.label}`}
                        value={search}
                        onChange={(e) =>
                          setFacetSearch((prev) => ({
                            ...prev,
                            [facet.field]: e.target.value,
                          }))
                        }
                        className="h-7 pl-8 pr-3 text-xs bg-background border-border"
                      />
                    </div>
                  )}

                  {/* Values */}
                  <div className="space-y-2">
                    {displayedValues.map((val) => {
                      const isPriceRange = val.type === "range" || facet.field === "price";

                      if (isPriceRange) {
                        const lo = val.low?.toString() ?? "";
                        const hi = val.high?.toString() ?? "";
                        const checked =
                          activeFilters[`${facet.field}.low`]?.[0] === lo &&
                          activeFilters[`${facet.field}.high`]?.[0] === hi;
                        return (
                          <label
                            key={val.label}
                            className="flex cursor-pointer select-none items-center gap-2.5 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleRange(facet.field, lo, hi)}
                              className="h-4 w-4 shrink-0 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            <span
                              className={
                                checked
                                  ? "font-medium text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {val.label}
                            </span>
                            {val.count > 0 && (
                              <span className="ml-auto text-[10px] text-muted-foreground/60">
                                {val.count}
                              </span>
                            )}
                          </label>
                        );
                      }

                      // Standard value filter
                      const checked =
                        Array.isArray(activeFilters[facet.field])
                          ? activeFilters[facet.field].includes(val.value)
                          : false;
                      return (
                        <label
                          key={val.value || val.label}
                          className="flex cursor-pointer select-none items-center gap-2.5 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleValue(facet.field, val.value)}
                            className="h-4 w-4 shrink-0 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          />
                          <span
                            className={
                              checked
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {val.label}
                          </span>
                          {val.count > 0 && (
                            <span className="ml-auto text-[10px] text-muted-foreground/60">
                              {val.count}
                            </span>
                          )}
                        </label>
                      );
                    })}

                    {displayedValues.length === 0 && (
                      <p className="text-xs text-muted-foreground">No matches found.</p>
                    )}
                  </div>

                  {/* Show more / less */}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowMore((prev) => ({
                          ...prev,
                          [facet.field]: !prev[facet.field],
                        }))
                      }
                      className="mt-1 text-[11px] font-semibold text-primary hover:underline focus:outline-none"
                    >
                      {isExpanded
                        ? "Show Less"
                        : `Show ${matchedValues.length - DISPLAY_LIMIT} More`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
