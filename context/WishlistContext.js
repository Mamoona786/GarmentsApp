// context/WishlistContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // array of products

  const isInWishlist = (id) => items.some(it => it.id === id);

  const addToWishlist = (product) => {
    setItems(prev => isInWishlist(product.id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const toggleWishlist = (product) => {
    setItems(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const clearWishlist = () => setItems([]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  }), [items]);

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
