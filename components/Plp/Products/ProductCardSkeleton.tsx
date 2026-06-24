import { Card, CardContent } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden border-0 shadow-sm">
      <div className="aspect-[4/5] w-full animate-pulse bg-slate-200" />
      <CardContent className="flex flex-col flex-1 gap-1 p-3">
        {/* Brand name placeholder */}
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        
        {/* Product title placeholder (two lines) */}
        <div className="mt-1 h-3.5 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200" />
        
        {/* Price placeholder */}
        <div className="mt-1.5 h-5 w-1/4 animate-pulse rounded bg-slate-200" />
        
        {/* Button placeholder */}
        <div className="mt-auto pt-3">
          <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
