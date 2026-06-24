# Implementation.md

# Searchspring Product Listing Page (PLP)

## Overview

Build a production-quality ecommerce Product Listing Page using the Searchspring Search API.

The goal is to demonstrate:

- Frontend architecture
- API integration
- State management
- Accessibility
- Responsive design
- Performance optimization
- Production-ready engineering practices

---

# Tech Stack

## Core

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- URL (Use URL for filters sharing, I don't think Zustand/Redux Toolkit is required)
- Zod
- nuqs

## UI

- shadcn/ui
- lucide-react
- class-variance-authority
- clsx

## Quality

- ESLint
- Prettier

---

# Architecture

```txt
src/
│
├── app/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── layout.tsx
│
├── components/
│   ├── search/
│   ├── product/
│   ├── filters/
│   ├── pagination/
│   ├── sorting/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── products/
│   ├── search/
│   ├── filters/
│   └── sorting/
│
├── services/
│   ├── searchspring.ts
│   └── api-client.ts
│
├── hooks/
│
├── store/
│   └── ui-store.ts
│
├── types/
│
├── lib/
│
└── utils/
```

---

# API Configuration

## Base Endpoint

```txt
https://api.searchspring.net/api/search/search.json
```

## Required Parameters

```txt
siteId=scmq7n
resultsFormat=native
```

## Example Request

```txt
/search.json
?siteId=scmq7n
&q=jeans
&page=2
&resultsFormat=native
```

---

# Assumptions

1. Empty query returns the default product catalog.

2. Facets are dynamically returned from Searchspring and should not be hardcoded.

3. Sorting values may require mapping UI values to Searchspring-supported parameters.

4. URL query parameters are treated as the single source of truth.

5. Pagination information is available in the API response.

---

# State Management Strategy

## URL State (Source of Truth)

Persist:

```txt
q
page
sort
filters
```

Example:

```txt
?q=jeans&page=2&sort=price-desc&brand=Levis,Nike
```

Benefits:

- Shareable URLs
- Browser back/forward support
- Refresh persistence
- Deep linking

Managed using:

```txt
nuqs
```

---

## Server State

Managed using:

```txt
TanStack Query
```

Stores:

```txt
Products
Facets
Pagination
Search Metadata
```

Benefits:

- Request deduplication
- Automatic caching
- Background refetching
- Loading/error handling

---

## Local UI State

Managed using:

```txt
Zustand
```

Stores:

```txt
Mobile filter drawer
Grid/List view mode
Search history
```

---

# API Layer

## Service Function

```ts
searchProducts({
  query,
  page,
  sort,
  filters,
  signal,
});
```

Responsibilities:

- Build query string
- Execute request
- Validate response with Zod
- Normalize data
- Handle API errors

---

## Request Cancellation

Support:

```txt
AbortController
```

Purpose:

- Prevent race conditions
- Cancel stale searches
- Improve responsiveness

Example:

```txt
User types:
j
je
jea
jean
jeans
```

Only the latest request should complete.

---

# Development Phases

---

# Phase 1 — Foundation

## Goals

Setup project infrastructure.

### Tasks

- Initialize Next.js
- Configure Tailwind
- Configure ESLint
- Configure Prettier
- Setup shadcn/ui
- Setup TanStack Query
- Setup nuqs
- Create folder structure

### Deliverable

Project starts successfully with foundational architecture in place.

---

# Phase 2 — Search Integration

## Components

### SearchBar

Features:

- Search input
- Search button
- Enter key support
- Debounced updates

### Behavior

- Read query from URL
- Update URL on search
- Trigger product fetch
- Preserve search state after refresh

### Deliverable

Fully functional search experience.

---

# Phase 3 — Product Listing Page

## Product Grid

Responsive layout:

```txt
Mobile  : 2 columns
Tablet  : 3 columns
Desktop : 4–5 columns
```

### Product Card

Display:

- Product image
- Product name
- Price
- MSRP
- Sale indication

Example:

```txt
$59.99    $89.99
```

MSRP appears only when:

```txt
msrp > price
```

### Deliverable

Responsive product listing grid.

---

# Phase 4 — Loading, Empty & Error States

## Loading State

Use skeleton loaders.

Components:

```txt
ProductCardSkeleton
ProductGridSkeleton
```

---

## Empty State

Display:

```txt
No Results Found
Try adjusting your search or filters.
```

---

## Error State

Display:

```txt
Something went wrong.
```

Include:

```txt
Retry Button
```

### Deliverable

All UX states handled gracefully.

---

# Phase 5 — Pagination

## Components

### Pagination Controls

Above results:

```txt
Previous
Page Numbers
Next
```

Below results:

```txt
Previous
Page Numbers
Next
```

### Requirements

- Current page highlighting
- Previous disabled on first page
- Next disabled on last page
- URL synchronization
- Scroll to top on page change

### Deliverable

Fully functional pagination.

---

# Phase 6 — Sorting

## Sort Dropdown

Options:

```txt
Relevance
Price: Low to High
Price: High to Low
Newest
Best Selling
```

### Requirements

- Persist in URL
- Refetch results automatically
- Maintain pagination and filters

### Deliverable

Sorting integrated into PLP.

---

# Phase 7 — Dynamic Filtering

## Dynamic Facets

Render facets directly from API response.

Possible facets:

```txt
Brand
Category
Color
Size
Price
```

---

## Components

```txt
FilterSidebar
FilterSection
FilterOption
SelectedFilters
```

---

## Features

- Multi-select filters
- Selected filter pills
- Remove individual filters
- Clear all filters
- Persist filters in URL
- Maintain filters during pagination

### Deliverable

Fully dynamic filtering system.

---

# Phase 8 — Mobile Experience

## Mobile Filter Drawer

Features:

```txt
Open Filters
Apply Filters
Clear Filters
```

Requirements:

- Responsive design
- Accessible interactions
- Sticky actions
- Overlay support

### Deliverable

Mobile-friendly filtering experience.

---

# Phase 9 — Accessibility

## Requirements

### Semantic HTML

Use:

```html
<header>
  <main>
    <section>
      <nav>
        <aside>
          <footer></footer>
        </aside>
      </nav>
    </section>
  </main>
</header>
```

### Keyboard Navigation

Support:

- Search input
- Filters
- Sorting
- Pagination

### ARIA

Use where appropriate:

```txt
aria-label
aria-current
aria-expanded
aria-live
```

### Additional Requirements

- Visible focus states
- Sufficient color contrast
- Screen-reader friendly controls

### Deliverable

Accessible user experience.

---

# Phase 10 — Performance Optimization

## Search Optimization

Debounced search:

```txt
300ms
```

---

## React Query

Query key:

```ts
["products", query, page, sort, filters];
```

Benefits:

- Caching
- Request deduplication
- Faster navigation

---

## Image Optimization

Use:

```txt
next/image
```

Features:

- Lazy loading
- Responsive image sizes
- Optimized delivery

---

## Rendering Optimization

Apply memoization only when beneficial.

Examples:

```txt
ProductCard
Large facet lists
```

Avoid unnecessary memoization.

### Deliverable

Responsive and performant experience.

---

# Bonus Features (If Time Allows)

## Grid/List Toggle

Allow switching between:

```txt
Grid View
List View
```

---

## Infinite Scroll

Alternative browsing mode using:

```txt
Intersection Observer
```

---

## Search History

Persist recent searches locally.

---

## Wishlist

Client-side wishlist state.

---

# Testing Strategy

Focus on high-value tests only.

## Priority Tests

### Search

Verify:

```txt
Debounce behavior
Search trigger
```

---

### Pagination

Verify:

```txt
Previous disabled on first page
Next disabled on last page
```

---

### URL Synchronization

Verify:

```txt
State restored after refresh
Query params update correctly
```

---

# Future Improvements

- Product Quick View
- Search Autocomplete
- Recently Viewed Products
- SSR Prefetching
- Analytics Tracking
- Storybook
- Playwright E2E Tests
- CI/CD Pipeline
- Personalization
- Recommendation Engine

---

# Deployment

## Platform

```txt
Vercel
```

## Repository

```txt
GitHub
```

---

# Definition of Done

A feature is complete only when:

- Responsive
- Accessible
- Type-safe
- URL synchronized
- Error handled
- Performance considered
- Production ready
- Documented

The final experience should feel like a real ecommerce storefront, not an API demo.
