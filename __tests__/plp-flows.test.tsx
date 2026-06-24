import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/context/cart-context';
import Plp from '@/components/Plp';
import * as searchspring from '@/services/searchspring';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    isReady: true,
    push: mockPush,
    replace: mockReplace,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

jest.mock('@/services/searchspring', () => ({
  searchProducts: jest.fn(),
}));

const mockData = {
  pagination: {
    totalResults: 20,
    currentPage: 1,
    totalPages: 2,
  },
  results: [
    {
      id: '1',
      name: 'Test Product 1',
      brand: 'TestBrand',
      price: '19.99',
      msrp: '29.99',
      imageUrl: 'https://via.placeholder.com/150',
      thumbnailImageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Test Product 2',
      brand: 'TestBrand',
      price: '24.99',
      msrp: '34.99',
      imageUrl: 'https://via.placeholder.com/150',
      thumbnailImageUrl: 'https://via.placeholder.com/150',
    },
  ],
  facets: [
    {
      field: 'category',
      label: 'Category',
      type: 'value',
      values: [{ type: 'value', value: 'Shirts', label: 'Shirts', count: 10 }],
    },
  ],
};

describe('PLP Integration Flows', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (searchspring.searchProducts as jest.Mock).mockResolvedValue(mockData);
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderPlp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Plp />
        </CartProvider>
      </QueryClientProvider>
    );

  describe('Render & Data', () => {
    it('renders product names after data loads', async () => {
      renderPlp();
      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      });
    });

    it('renders pagination buttons when totalPages > 1', async () => {
      renderPlp();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /go to page 2/i })).toBeInTheDocument();
      });
    });

    it('renders filter facets from the API response', async () => {
      renderPlp();
      await waitFor(() => {
        expect(screen.getByText('Shirts')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination Flow', () => {
    it('page button is clickable without throwing errors', async () => {
      renderPlp();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /go to page 2/i })).toBeInTheDocument();
      });

      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /go to page 2/i }));
      }).not.toThrow();
    });
  });

  describe('Filter Flow', () => {
    it('calls router.push with filter param when a facet is selected', async () => {
      renderPlp();

      await waitFor(() => {
        expect(screen.getByText('Shirts')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText(/Shirts/i);
      fireEvent.click(checkbox);

      await waitFor(() => {
        const pushCalls = mockPush.mock.calls.map(c => JSON.stringify(c));
        expect(pushCalls.some(arg => arg.includes('filter.category'))).toBe(true);
      });
    });
  });
});
