# Athos PLP

Next.js (Pages Router) Product Listing Page integrating Searchspring Search API.

---

## Tech Stack

- **Core:** Next.js 13.5 (Pages Router), React 18, TypeScript
- **State & Caching:** TanStack Query v5
- **URL State:** `nuqs` (synchronizes search, pagination, sort, and filters to URL)
- **Styling:** Tailwind CSS v4, Radix UI Primitives, Lucide React

---

## Architecture

- **`hooks/use-plp.ts`**: Central data controller. Parses URL params, fetches data via TanStack Query, and manages infinite scroll accumulation.
- **`components/Plp/Filters/`**: Facet rendering, dynamic search within facets, and URL sync.
- **`components/Plp/Products/`**: Product grid layout, SearchBar, Sorting, Pagination, and View mode toggle.
- **`context/cart-context.tsx`**: Local storage-based cart state.
- **`services/searchspring.ts`**: API wrapper logic.

---

## Setup

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Developer Notes / Assumptions

- **URL as Source of Truth:** Filters, sort, and search query are driven strictly by the URL (managed via `nuqs`).
- **Pagination vs Infinite Scroll:** Both are implemented. Standard pagination updates the `page` URL param. Infinite Scroll accumulates results in local state within `use-plp.ts`.
- **Loading States:** I implemented full skeleton grids for all loading states in standard pagination. For Infinite Scroll, I append skeletons to the bottom of the list.
- **Filter Locking:** To prevent conflicting category requests, category-related facets are locked (`pointer-events-none`) during background fetches.
- **Client-Side Cart:** Cart state lives in `localStorage`.

---

## Performance

- **Caching:** TanStack Query caches responses (`staleTime: 5 mins`, `gcTime: 10 mins`) for immediate UI updates when reverting to previous states.
- **Memoization:** `ProductCard` uses `React.memo` to avoid re-renders when parent states (like mobile menu toggles) change.
- **Placeholder Data:** Query uses `placeholderData: keepPreviousData` to prevent UI layout shift while new data fetches.

---

## Future Improvements

- Autocomplete, Search History

---

## Testing

I have implemented integration tests using **Jest** and **React Testing Library** to cover the core PLP flows:

- **Pagination Flow**: Verifies that page changes update the URL correctly.
- **Filter Flow**: Verifies that selecting a facet updates the URL parameters.

Run the test suite using:

```bash
npm run test
```
