import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { productDetail } from "../feautres/cartSlice";
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
const selectVariantSource = (product) => {
  if (product?.selectedVariant) {
    return product.selectedVariant;
  }
  if (product?.variant) {
    return product.variant;
  }
  if (Array.isArray(product?.variants)) {
    return (
      product.variants.find((variant) => variant && !variant.isDeleted) ||
      product.variants[0]
    );
  }
  return null;
};

const formatAttributesForWishlist = (variant) => {
  if (!variant) {
    return [];
  }

  const attributes = Array.isArray(variant?.attributes)
    ? variant.attributes
    : Array.isArray(variant?.options)
    ? variant.options
    : [];

  return attributes
    .map((attribute) => {
      const type =
        attribute?.type ||
        attribute?.name ||
        attribute?.key ||
        attribute?.label ||
        '';
      const value =
        attribute?.value ||
        attribute?.option ||
        attribute?.label ||
        attribute?.name ||
        '';

      if (!type || !value) {
        return null;
      }

      return {
        type: String(type),
        value: String(value),
      };
    })
    .filter(Boolean);
};

const resolveWishlistPrice = (product) => {
  if (!product) {
    return null;
  }

  const candidates = [
    product?.price?.max,
    product?.price?.value,
    product?.price?.min,
    product?.price?.current,
    product?.sellingPrice,
    product?.currentPrice,
    product?.price,
  ];

  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  if (Array.isArray(product?.variants)) {
    for (const variant of product.variants) {
      const variantPrice = resolveWishlistPrice(variant);
      if (variantPrice !== null) {
        return variantPrice;
      }
    }
  }

  return null;
};

const buildWishlistPayload = (product) => {
  const productId = product?._id || product?.id || product?.productId;
  if (!productId) {
    return null;
  }

  const variantSource = selectVariantSource(product);
  const attributes = formatAttributesForWishlist(variantSource);

  const payload = {
    productId,
    name: product?.name || product?.title || 'Product',
    price: resolveWishlistPrice(product) ?? 0,
    image: getProductImage(product),
    description:
      product?.description ||
      product?.shortDescription ||
      product?.summary ||
      '',
  };

  if (attributes.length > 0) {
    payload.variant = { attributes };
  }

  return payload;
};
const ITEMS_PER_BATCH = 8;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductsFilter] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const sentinelRef = useRef(null);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  }, []);

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

  useEffect(() => {
    const fetchWishlistIds = async () => {
      if (!user?.token) {
        setWishlist([]);
        return;
      }

      try {
        const response = await axios.get(`${apiurl}/ecommerce/wishlist`, {
          headers: { Authorization: user.token },
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

        const rawItems = candidates.find(Array.isArray) || [];
        const ids = rawItems
          .map((entry) => {
            if (!entry) {
              return null;
            }
            const product =
              entry.product ||
              entry.productDetails ||
              entry.productInfo ||
              entry.productData ||
              entry;
            const id = entry.productId || product?._id || product?.id;
            return id ? String(id) : null;
          })
          .filter(Boolean);

        setWishlist(Array.from(new Set(ids)));
      } catch (error) {
        console.error("Failed to load wishlist ids:", error);
      }
    };

    fetchWishlistIds();
  }, [user?.token]);

  const showProductCard = (item) => {
    const productId = (item?._id || item?.id || item?.productId) ? String(item?._id || item?.id || item?.productId) : null;
    if (!productId) {
      return;
    }

    dispatch(productDetail(item));
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = async (product) => {
    const productId = product?._id || product?.id || product?.productId;
    if (!productId) {
      return;
    }

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
      toast.success("Added to wishlist.");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Could not add to wishlist. Please try again.");
    }
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
            const productId = (item?._id || item?.id || item?.productId) ? String(item?._id || item?.id || item?.productId) : null;
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
                      toggleWishlist(item);
                    }}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2F251F] backdrop-blur transition hover:bg-white"
                    aria-label={isWishlisted ? "In wishlist" : "Add to wishlist"}
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
