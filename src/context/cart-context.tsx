"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Define types
type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  variantId?: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: { item: Omit<CartItem, "id"> } }
  | { type: "REMOVE_FROM_CART"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

// Create context
const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = {
        ...action.payload.item,
        id: `${action.payload.item.productId}-${action.payload.item.size}`,
      };
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + newItem.quantity,
                  item.stock
                ),
              }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        return { ...state, items: [...state.items, newItem] };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(action.payload.quantity, item.stock)
                ),
              }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_CART":
      return { ...action.payload };

    default:
      return state;
  }
};

// Provider component
type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  // Track which user's cart is active
  const pathname = usePathname();
  const [uid, setUid] = useState<string>(() => {
    if (typeof window === "undefined") return "guest";
    return localStorage.getItem("userId") || "guest";
  });
  const [state, dispatch] = useReducer(
    cartReducer,
    { items: [] },
    (initial) => {
      if (typeof window !== "undefined") {
        try {
          const currentUid = localStorage.getItem("userId") || "guest";
          const key = `cart:${currentUid}`;
          const stored = localStorage.getItem(key);
          return stored ? JSON.parse(stored) : initial;
        } catch {
          return initial;
        }
      }
      return initial;
    }
  );

  // When user changes (navigation or focus), update uid and rehydrate cart
  useEffect(() => {
    const refreshUid = () => {
      const next = localStorage.getItem("userId") || "guest";
      setUid((prev) => (prev !== next ? next : prev));
    };

    refreshUid();

    const onFocus = () => refreshUid();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userId") refreshUid();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname]);

  // Rehydrate cart when uid changes
  useEffect(() => {
    try {
      const key = `cart:${uid}`;
      const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      const nextState: CartState = stored ? JSON.parse(stored) : { items: [] };
      dispatch({ type: "SET_CART", payload: nextState });
    } catch {
      // ignore
    }
  }, [uid]);

  useEffect(() => {
    try {
      const key = `cart:${uid}`;
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state, uid]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
