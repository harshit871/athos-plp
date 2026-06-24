import type { ParsedUrlQuery } from "querystring";

/**
 * Extracts all `filter.*` entries from Next.js router.query and returns them
 * as a Record<field, string[]>.  Next.js already parses repeated params
 * (e.g. `?filter.brand=Levis&filter.brand=Nike`) into a string[].
 */
export function getActiveFilters(query: ParsedUrlQuery): Record<string, string[]> {
  const filters: Record<string, string[]> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (!key.startsWith("filter.") || value === undefined || value === null) return;

    const field = key.slice("filter.".length);
    filters[field] = Array.isArray(value) ? value : [value as string];
  });

  return filters;
}
