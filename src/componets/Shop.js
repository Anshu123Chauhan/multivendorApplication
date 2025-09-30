import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import { addToCart, productDetail } from "../feautres/cartSlice";
import { useNavigate } from "react-router";
import AnimatePage from "../animation/AnimatePage";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import axios from "axios";
import { apiurl } from "../config/config";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x800.png?text=ENS";

const getProductImage = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  if (images.length === 0) {
    return FALLBACK_IMAGE;
  }

  const first = images[0];
  if (typeof first === "string") {
    return first;
  }

  if (first && typeof first === "object") {
    return first.url || first.src || FALLBACK_IMAGE;
  }

  return FALLBACK_IMAGE;
};

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric === 0) {
    return value ?? "";
  }

  return numeric.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const computeDiscount = (price, mrp) => {
  const current = Number(price);
  const original = Number(mrp);

  if (!current || !original || original <= current) {
    return null;
  }

  return Math.round(((original - current) / original) * 100);
};
const ITEMS_PER_BATCH = 8;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductsFilter] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const sentinelRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        `${apiurl}/ecommerce/product/listing`,
        {
          // Body can be empty for now or add filters if needed
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
        setProductsFilter(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showProductCard = (item) => {
    const productId = item?._id || item?.id;
    if (!productId) {
      return;
    }

    dispatch(productDetail(item));
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = (id) => {
    if (!id) {
      return;
    }

    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filterP = (cat) => {
    const result = products.filter((item) => item.category === cat);
    setProductsFilter(result);
  };

  const setAllCategory = () => setProductsFilter(products);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return productFilter;
    }

    const lowered = searchTerm.toLowerCase();
    return productFilter.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(lowered) ||
        item?.brand?.toLowerCase()?.includes(lowered)
    );
  }, [productFilter, searchTerm]);

  useEffect(() => {
    setVisibleCount(
      Math.min(ITEMS_PER_BATCH, Math.max(filteredProducts.length, 0))
    );
  }, [searchTerm, productFilter, filteredProducts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) =>
            Math.min(prev + ITEMS_PER_BATCH, filteredProducts.length)
          );
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filteredProducts.length, visibleCount]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <AnimatePage>
      <main className="min-h-screen bg-[#faf7f3] px-4 pb-16 pt-6 sm:px-6 lg:px-10 mx-auto w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
        {/* Header, Search, and Sort */}
        <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t("shop.subtitle", "Find your favourites")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#2F251F]">
              {t("shop.title", "All Products")}
            </h2>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? "style" : "styles"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:max-w-xl">
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder={t("shop.search", "Search by product name")}
                className="h-11 w-[280px] rounded-full border border-transparent bg-white px-5 pr-12 text-sm font-medium text-[#2F251F] shadow focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-amber-500">
                <BsSearch className="h-4 w-4" />
              </span>
            </div>

            <select className="h-11 w-full rounded-full border border-amber-100 bg-white px-4 text-sm font-medium text-[#2F251F] focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((item) => {
            const productId = item?._id || item?.id;
            const image = getProductImage(item);
            const price = item?.price.max ?? item?.sellingPrice ?? item?.currentPrice;
            const mrp = item?.lastPrice ?? item?.mrp ?? item?.originalPrice;
            const discount = computeDiscount(price, mrp);
            const isWishlisted = productId ? wishlist.includes(productId) : false;
            const rating = item?.rating ? Number(item.rating).toFixed(1) : null;
            const reviews = item?.reviewsCount ?? item?.reviews ?? item?.sold ?? null;

            return (
              <article
                onClick={() => showProductCard(item)}
                key={productId || image}
                className="group relative flex cursor-pointer flex-col overflow-hidden  border border-transparent bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
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
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(productId);
                    }}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2F251F] backdrop-blur transition hover:bg-white"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWishlisted ? (
                      <FaHeart className="h-4 w-4" />
                    ) : (
                      <FaRegHeart className="h-4 w-4" />
                    )}
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
                      {/* {item?.brand || "Featured"} */}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-[#2F251F] line-clamp-2 group-hover:text-amber-700">
                      {item?.name || "Product"}
                    </h3>
                    {item?.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-[#2F251F]">
                      {formatCurrency(price)}
                    </span>
                    {mrp && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(mrp)}
                      </span>
                    )}
                    {discount && (
                      <span className="text-sm font-semibold text-red-500">
                        ({discount}% OFF)
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <ToastContainer position="top-right" autoClose={1000} />
      </main>
    </AnimatePage>
  );
}


















