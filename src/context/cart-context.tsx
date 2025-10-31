"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

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
  | { type: "CLEAR_CART" };

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

    default:
      return state;
  }
};

// Provider component
type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    { items: [] },
    (initial) => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("cart");
          return stored ? JSON.parse(stored) : initial;
        } catch {
          return initial;
        }
      }
      return initial;
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

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
