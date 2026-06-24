import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Plus, Minus } from "lucide-react";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const { name, imageUrl, thumbnailImageUrl, brand, price, msrp, on_sale } = product;
  const { cart, addToCart, updateQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const numericPrice = parseFloat(price) || 0;
  const numericMsrp = parseFloat(msrp) || 0;
  const isOnSale = on_sale?.[0] === "Yes" || numericMsrp > numericPrice;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isAdded = quantityInCart > 0;

  return (
    <>
      <Card
        className="group relative flex cursor-pointer flex-col overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
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
        <CardContent className="flex flex-col flex-1 gap-1 p-3">
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

          <div className="mt-auto overflow-hidden">
            {isAdded ? (
              <div className="flex h-8 w-full items-center justify-between rounded-lg border border-border bg-muted/20">
                <Button
                  variant="ghost"
                  className="h-full w-8 rounded-none border-none p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantityInCart - 1);
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-semibold text-foreground px-2 select-none">
                  {quantityInCart}
                </span>
                <Button
                  variant="ghost"
                  className="h-full w-8 rounded-none border-none p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantityInCart + 1);
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full gap-1.5 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
