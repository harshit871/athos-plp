import { Card, CardContent } from "@/components/ui/card";

interface ProductCardSkeletonProps {
  viewMode?: "grid" | "list";
}

const ProductCardSkeleton = ({ viewMode = "grid" }: ProductCardSkeletonProps) => {
  return (
    <Card
      className={`flex overflow-hidden border-0 shadow-sm ${
        viewMode === "list" ? "flex-row sm:h-48" : "flex-col"
      }`}
    >
      <div
        className={`animate-pulse bg-slate-200 shrink-0 ${
          viewMode === "list"
            ? "w-32 sm:w-48 aspect-square"
            : "aspect-[4/5] w-full"
        }`}
      />
      <CardContent
        className={`flex flex-1 gap-1 p-3 ${
          viewMode === "list" ? "flex-col justify-center sm:p-5" : "flex-col"
        }`}
      >

        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        

        <div className="mt-1 h-3.5 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200" />
        

        <div className="mt-1.5 h-5 w-1/4 animate-pulse rounded bg-slate-200" />
        
        <div
          className={`mt-auto overflow-hidden ${
            viewMode === "list" ? "pt-3 max-w-xs" : "pt-3"
          }`}
        >
          <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
