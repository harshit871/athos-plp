import type { Product } from "@/types";
import ProductCard from "@/components/Plp/Products/ProductCard";
import ProductGridSkeleton from "@/components/Plp/Products/ProductGridSkeleton";

interface ProductResultsProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const ProductResults = ({ products, isLoading, isError, refetch }: ProductResultsProps) => {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold">Something went wrong.</h3>
        <p className="mt-2 text-muted-foreground">
          We encountered an error while fetching the products.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold">No Results Found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductResults;

