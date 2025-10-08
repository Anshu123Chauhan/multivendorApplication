// src/pages/SearchResults.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiurl } from "../config/config";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || "";
  const [primaryResults, setPrimaryResults] = useState([]);
  const [extraResults, setExtraResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Get user from localStorage or context
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${apiurl}/ecommerce/search/aisearch`, { query });
        const { data, extras } = res.data;
        setPrimaryResults(data || []);
        setExtraResults(extras || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const formatCurrency = (value) => `$${value}`;

  const buildWishlistPayload = (product) => ({
    productId: product._id,
    name: product.name,
    price: product.priceRange?.min,
    image: product.images?.[0] || "",
  });

  const toggleWishlist = async (product) => {
    const productId = product?._id || product?.id || product?.productId;
    if (!productId) return;

    const normalizedId = String(productId);

    if (!user?.token) {
      toast.error("Please login to save items to your wishlist.");
      navigate("/login");
      return;
    }

    if (wishlist.includes(normalizedId)) {
      toast.info("This item is already in your wishlist.");
      return;
    }

    const payload = buildWishlistPayload(product);
    if (!payload) {
      toast.error("Unable to prepare wishlist data for this product.");
      return;
    }

    try {
      await axios.post(`${apiurl}/ecommerce/wishlist/add`, payload, {
        headers: { Authorization: user.token },
      });
      setWishlist((prev) => [...prev, normalizedId]);
      setWishlistCount((prev) => prev + 1);
      toast.success("Added to wishlist.");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Could not add to wishlist. Please try again.");
    }
  };

  const showProductCard = (item) => {
    navigate(`/product/${item._id}`);
  };

  const renderCard = (item) => {
    const image = item.images?.[0] || "";
    const price = item.priceRange?.min || 0;
    const mrp = item.priceRange?.max || null;
    const discount = mrp && price !== mrp ? Math.round(((mrp - price) / mrp) * 100) : null;
    const isWishlisted = wishlist.includes(item._id);
    const rating = null; // Add rating if available
    const reviews = null; // Add reviews if available

    return (
      <article
        key={item._id}
        onClick={() => showProductCard(item)}
        className="group relative flex cursor-pointer flex-col overflow-hidden border border-transparent bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
      >
        <div className="relative h-[250px] overflow-hidden">
          <img
            src={image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(item);
            }}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2F251F] backdrop-blur transition hover:bg-white"
            aria-label={isWishlisted ? "In wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? <FaHeart className="h-4 w-4" /> : <FaRegHeart className="h-4 w-4" />}
          </button>

          {rating && (
            <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2F251F] shadow">
              <FaStar className="text-amber-500" />
              <span>{rating}</span>
              {reviews ? <span className="text-gray-400">({reviews})</span> : null}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between px-3 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-400">
              {item.brand?.name || "Featured"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-[#2F251F] line-clamp-2 group-hover:text-amber-700">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[#2F251F]">{formatCurrency(price)}</span>
            {mrp && mrp !== price && (
              <span className="text-sm text-gray-400 line-through">{formatCurrency(mrp)}</span>
            )}
            {discount && <span className="text-sm font-semibold text-red-500">({discount}% OFF)</span>}
          </div>
        </div>
      </article>
    );
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500 text-lg">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Search results for "{query}"</h2>

      {/* Primary Results */}
      {primaryResults.length > 0 && (
        <>
          <h3 className="text-xl font-medium mb-4">Top Matches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {primaryResults.map(renderCard)}
          </div>
        </>
      )}

      {/* Extra Results */}
      {extraResults.length > 0 && (
        <>
          <h3 className="text-xl font-medium mb-4">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {extraResults.map(renderCard)}
          </div>
        </>
      )}

      {/* No Results */}
      {primaryResults.length === 0 && extraResults.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No results found for "{query}".
        </p>
      )}
    </div>
  );
}
