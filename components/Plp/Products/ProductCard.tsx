import Image from "next/image";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, imageUrl, thumbnailImageUrl, brand, price, msrp, on_sale } = product;

  const numericPrice = parseFloat(price) || 0;
  const numericMsrp = parseFloat(msrp) || 0;
  const isOnSale = on_sale?.[0] === "Yes" || numericMsrp > numericPrice;

  return (
    <Card className="group relative flex cursor-pointer flex-col overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-slate-100">
        <Image
          src={imageUrl || thumbnailImageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {isOnSale && (
          <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white leading-none">
            Sale
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-1 p-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          {isOnSale && numericMsrp > numericPrice ? (
            <>
              <span className="text-base font-bold text-red-600">
                ${numericPrice.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                ${numericMsrp.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-foreground">
              ${numericPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
