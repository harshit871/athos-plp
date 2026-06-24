# Searchspring Product Listing Page (PLP)

A production-quality Product Listing Page (PLP) built in Next.js (Pages Router) featuring real-time faceted search, debounced text search, URL state persistence, persistent shopping cart actions, and high-performance caching.

---

## 1. Tech Stack Choices

* **Core Framework:** Next.js 13.5 (Pages Router) with TypeScript & React 18.
* **Server State & Caching:** `@tanstack/react-query` (TanStack Query v5) for request caching, automatic background fetching, and preventing race conditions.
* **URL State Management:** `nuqs` (formerly `next-usequerystate`) to synchronize the search query, pagination, and sorting directly to browser URL parameters.
* **Styling & Components:** Tailwind CSS (v4) with custom components leveraging Radix UI primitives and Lucide React icons.

---

## 2. Architecture Overview

```txt
athos-plp/
├── components/
│   ├── ui/               # Reusable UI primitives (Button, Card, Input)
│   └── Plp/
│       ├── Header.tsx    # Sticky header with cart badge icon
│       ├── Filters/      # Facet accordion sidebar with search and filter locks
│       └── Products/     # Product grid, searchbar, sort dropdown, and pagination
├── context/
│   └── cart-context.tsx  # Global state manager for local storage-persisted cart
├── hooks/
│   ├── use-debounce.ts   # Custom hook for search-typing delay
│   └── use-plp.ts        # Core controller: fetches data, syncs URL params, and manages infinite scroll accumulation
├── lib/
│   ├── utils.ts          # Styling class-name merger helpers
│   └── filters.ts        # Parses active filters from the URL query strings
├── services/
│   └── searchspring.ts   # Client wrapper for the Searchspring Search API
├── pages/
│   ├── _app.tsx          # Query Client and Cart Provider mount wrapper
│   └── index.tsx         # Main entry point rendering the PLP view
├── types.ts              # TypeScript definitions for facets, products, pagination
└── implementation.md     # Phase checklist and requirements
```

---

## 3. Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production Build & Verification:**
   ```bash
   npm run build
   ```

---

## 4. Tradeoffs / Assumptions

* **Client-Side Cart:** The cart is maintained on the client using `localStorage`. SSR hydration warnings are prevented by deferring state synchronization until after the client mounts (`useEffect` inside the `CartProvider`).
* **Infinite Scroll vs Pagination:** Both are supported. When Infinite Scroll is enabled, `use-plp.ts` accumulates product results in local state. Standard pagination relies purely on the URL `page` parameter.
* **Loading States (Skeletons):** Full skeleton grids are shown on the initial load and when executing a *new* search or filter query. Standard page changes use a subtle 50% opacity transition to avoid layout shift. Infinite scroll appends skeleton cards at the bottom.
* **Localized Filter Locking:** To prevent users from selecting conflicting sub-category facets while a fetch is in progress, only the category-related facets are locked (`pointer-events-none opacity-50`). Other facets remain interactive.

---

## 5. Performance Considerations

* **Query Caching:** TanStack Query is configured with `staleTime: 5 mins` and `gcTime: 10 mins`. Navigating back and forth or toggling the same checkbox works instantly by serving cached data.
* **Memoization:** The `ProductCard` component is wrapped in `React.memo` to skip redundant reconciliation when unrelated PLP elements (like the filter drawer) update.
* **Refetch Persistence:** The hook configures `placeholderData: keepPreviousData` to keep current facets visible and prevent layout layout flashes when query keys shift.

---

## 6. Future Improvements

* **Cart Drawer UI:** Add a slide-out panel to view, modify quantities, and clear items from the cart.
* **SSR Prefetching:** Prefetch the initial PLP query server-side inside `getServerSideProps` to serve indexable SEO markup out-of-the-box.
* **E2E Playwright Tests:** Implement automated visual and functional testing for desktop hover interactions, pagination clamping, and filter selections.
