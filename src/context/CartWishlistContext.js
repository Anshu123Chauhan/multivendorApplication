import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { apiurl } from "../config/config";

const CartWishlistContext = createContext(null);

const computeCartQuantity = (items) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => total + (Number(item?.quantity) || 1), 0);
};

export function CartWishlistProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const getUserToken = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      return stored?.token ?? null;
    } catch (error) {
      console.error("Failed to parse user token", error);
      return null;
    }
  }, []);

  const refreshCartCount = useCallback(async () => {
    const token = getUserToken();
    if (!token) {
      setCartCount(0);
      return 0;
    }

    try {
      const response = await axios.get(`${apiurl}/ecommerce/cart/list`, {
        headers: { Authorization: token },
      });

      const items = response?.data?.cart?.items ?? [];
      const total = computeCartQuantity(items);
      setCartCount(total);
      return total;
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
      return 0;
    }
  }, [getUserToken]);

  const refreshWishlistCount = useCallback(async () => {
    const token = getUserToken();
    if (!token) {
      setWishlistCount(0);
      return 0;
    }

    try {
      const response = await axios.get(`${apiurl}/ecommerce/wishlist`, {
        headers: { Authorization: token },
      });

      const payload = response?.data ?? {};
      const candidates = [
        payload?.wishlist?.items,
        payload?.wishlist,
        payload?.data?.items,
        payload?.data,
        payload?.items,
        Array.isArray(payload) ? payload : null,
      ];

      const items = candidates.find(Array.isArray) || [];
      const total = items.length;
      setWishlistCount(total);
      return total;
    } catch (error) {
      console.error("Failed to refresh wishlist count:", error);
      return 0;
    }
  }, [getUserToken, wishlistCount]);

  useEffect(() => {
    const bootstrapCounts = () => {
      const token = getUserToken();
      if (!token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }
      refreshCartCount();
      refreshWishlistCount();
    };

    bootstrapCounts();

    const handleAuthChange = () => {
      bootstrapCounts();
    };

    window.addEventListener("userLoggedIn", handleAuthChange);
    window.addEventListener("userLoggedOut", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleAuthChange);
      window.removeEventListener("userLoggedOut", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [getUserToken, refreshCartCount, refreshWishlistCount]);

  const contextValue = useMemo(
    () => ({
      cartCount,
      wishlistCount,
      setCartCount,
      setWishlistCount,
      refreshCartCount,
      refreshWishlistCount,
    }),
    [cartCount, wishlistCount, refreshCartCount, refreshWishlistCount]
  );

  return (
    <CartWishlistContext.Provider value={contextValue}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
};


