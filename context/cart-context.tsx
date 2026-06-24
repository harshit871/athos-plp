import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem("athos_cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsInitialized(true);
  }, []);


  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("athos_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === productId);
      if (!existingItem) return prevCart;


      if (existingItem.quantity === quantity) return prevCart;

      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      }

      return prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
