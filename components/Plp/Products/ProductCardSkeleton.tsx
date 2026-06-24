const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="aspect-[4/5] w-full animate-pulse rounded-md bg-slate-200"></div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200"></div>
        <div className="mt-2 h-6 w-1/4 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
