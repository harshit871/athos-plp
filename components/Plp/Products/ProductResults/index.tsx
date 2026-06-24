import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { searchProducts } from "@/services/searchspring";
import ProductCard from "@/components/Plp/Products/ProductCard";
import ProductGridSkeleton from "@/components/Plp/Products/ProductGridSkeleton";

const ProductResults = () => {
  const [q] = useQueryState("q", parseAsString.withDefault(""));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [sort] = useQueryState("sort", parseAsString);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", { q, page, sort }],
    queryFn: ({ signal }) => searchProducts({ q, page, sort: sort || undefined }, signal),
  });

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
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.results || data.results.length === 0) {
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
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {data?.results?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductResults;
