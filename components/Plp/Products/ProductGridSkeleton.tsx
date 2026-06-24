import ProductCardSkeleton from "@/components/Plp/Products/ProductCardSkeleton";

interface ProductGridSkeletonProps {
  viewMode?: "grid" | "list";
}

const ProductGridSkeleton = ({ viewMode = "grid" }: ProductGridSkeletonProps) => {
  return (
    <div
      className={
        viewMode === "list"
          ? "mt-6 flex flex-col gap-4"
          : "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
