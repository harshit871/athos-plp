import React, { useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { cart, addToCart, updateQuantity } = useCart();

  // Prevent body scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { name, imageUrl, thumbnailImageUrl, brand, price, msrp, on_sale, size, color, sku } = product;

  const numericPrice = parseFloat(price) || 0;
  const numericMsrp = parseFloat(msrp) || 0;
  const isOnSale = on_sale?.[0] === "Yes" || numericMsrp > numericPrice;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isAdded = quantityInCart > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative flex w-full max-w-2xl transform flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 animate-in zoom-in-95 md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-card/85 p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Product Image Column */}
        <div className="relative aspect-square w-full bg-slate-100 md:aspect-auto md:w-1/2">
          <Image
            src={imageUrl || thumbnailImageUrl}
            alt={name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          {isOnSale && (
            <div className="absolute left-4 top-4 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Sale
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex w-full flex-col justify-between p-6 md:w-1/2">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {brand}
              </span>
              <h2 id="modal-title" className="mt-1 text-lg font-bold leading-snug text-foreground">
                {name}
              </h2>
              {sku && (
                <span className="mt-1 block text-[10px] font-mono text-muted-foreground/60">
                  SKU: {sku}
                </span>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3">
              {isOnSale && numericMsrp > numericPrice ? (
                <>
                  <span className="text-2xl font-black text-red-600">
                    ${numericPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${numericMsrp.toFixed(2)}
                  </span>
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-red-600 dark:bg-red-950/50">
                    Save ${(numericMsrp - numericPrice).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black text-foreground">
                  ${numericPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Custom attributes (Sizes / Colors) */}
            {color && color.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Available Colors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {color.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {size && size.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Available Sizes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {size.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border bg-muted/10 px-2 py-0.5 text-[10px] font-semibold text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action trigger */}
          <div className="mt-8">
            {isAdded ? (
              <div className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-muted/20">
                <Button
                  variant="ghost"
                  className="h-full px-4 rounded-none border-none hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold text-foreground px-4 select-none">
                  {quantityInCart} in Cart
                </span>
                <Button
                  variant="ghost"
                  className="h-full px-4 rounded-none border-none hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="default"
                className="w-full gap-2 transition-all duration-300 py-5 text-sm"
                onClick={() => addToCart(product)}
              >
                <Plus className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
