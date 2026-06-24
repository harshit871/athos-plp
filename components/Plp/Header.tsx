import { useCart } from "@/context/cart-context";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-widest uppercase text-foreground">
            Ecommerce
          </span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-primary">
            Store
          </span>
        </div>

        {/* Cart Icon */}
        <button
          className="group relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="h-5.5 w-5.5 transition-transform group-hover:scale-105" />
          {totalItems > 0 && (
            <span
              className={`absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md transition-all duration-300`}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
