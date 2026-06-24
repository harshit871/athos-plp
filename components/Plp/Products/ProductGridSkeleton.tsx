import ProductCardSkeleton from "@/components/Plp/Products/ProductCardSkeleton";

const ProductGridSkeleton = () => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
