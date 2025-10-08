import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Heart, Loader2 } from "lucide-react";
import { apiurl } from "../config/config";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useNotification } from "../reusableComponent/NotificationProvider";
import ConfirmMassage from "../reusableComponent/ConfirmMassage";
const FALLBACK_IMAGE = "https://via.placeholder.com/600x800.png?text=ENS";

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const normalizeWishlistItem = (entry, index) => {
  const product =
    entry?.product || entry?.productDetails || entry?.productInfo || entry?.productData || entry;

  const productId =
    entry?.productId ||
    product?._id ||
    product?.id ||
    product?.slug ||
    product?.sku ||
    `wishlist-${index}`;

  const imageSources = [
    entry?.image,
    product?.image,
    Array.isArray(entry?.images) ? entry.images[0] : null,
    Array.isArray(product?.images) ? product.images[0] : null,
  ];

  let image = FALLBACK_IMAGE;
  for (const source of imageSources) {
    if (!source) {
      continue;
    }
    if (typeof source === "string" && source.trim()) {
      image = source;
      break;
    }
    if (typeof source === "object") {
      const candidate = source.url || source.src || source.imageUrl || source.preview;
      if (candidate) {
        image = candidate;
        break;
      }
    }
  }

  const priceCandidate =
    entry?.price ??
    entry?.sellingPrice ??
    entry?.currentPrice ??
    product?.price ??
    product?.sellingPrice ??
    product?.currentPrice;
  const mrpCandidate =
    entry?.mrp ??
    entry?.originalPrice ??
    product?.mrp ??
    product?.originalPrice;

  const price = Number(priceCandidate);
  const mrp = Number(mrpCandidate);

  return {
    id: String(productId),
    productId,
    name: product?.name || product?.title || entry?.name || "Saved product",
    description: entry?.description || product?.description || "",
    image,
    price: Number.isFinite(price) ? price : null,
    mrp: Number.isFinite(mrp) ? mrp : null,
    rating: product?.rating || product?.averageRating || null,
    reviews: product?.reviewsCount || product?.reviews || product?.sold || null,
    variant:product?.variant
  };
};

export default function WishList() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setWishlistCount } = useCartWishlist();
  const [openDialog, setOpenDialog] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  }, []);
  const fetchWishlist = async () => {
            if (!user?.token) {
        setItems([]);
        setLoading(false);
        setWishlistCount(0);
        return;
      }

      setLoading(true);
      setError(null);

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
        const sanitized = rawItems
          .filter(Boolean)
          .map((entry, index) => normalizeWishlistItem(entry, index));

        setItems(sanitized);
        setWishlistCount(sanitized.length);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        setError("Unable to load wishlist right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    const run = async () => {
      if (!user?.token) {
        setItems([]);
        setLoading(false);
        setWishlistCount(0);
        return;
      }

      setLoading(true);
      setError(null);

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
        const sanitized = rawItems
          .filter(Boolean)
          .map((entry, index) => normalizeWishlistItem(entry, index));

        setItems(sanitized);
        setWishlistCount(sanitized.length);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        setError("Unable to load wishlist right now. Please try again later.");
        setWishlistCount(0);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [setWishlistCount, user?.token]);

  const handleViewProduct = (item) => {
    if (!item?.productId) {
      return;
    }
    navigate(`/product/${item.productId}`);
  };
  const handleClear = async () => {
    try {
      if (!user?.token) return showNotification("Please login!", "success");

      await axios.delete(`${apiurl}/ecommerce/wishlist/clear`, {
        headers: { Authorization: user.token },
      });

      showNotification("Wishlist cleared successfully!", "success");
      setOpenDialog(false)
      setItems([]);
    } catch (error) {
      showNotification("Failed to clear wishlist.", "error");
    }
  };
   const removeItem = async (item) => {
    console.log(item)
    const payload={
      productId:item.id,
      variant:item.variant
    }
    try {
      if (!user?.token) return showNotification("Please login!", "success");

      await axios.post(`${apiurl}/ecommerce/wishlist/remove`,payload, {
        headers: { Authorization: user.token },
      });

      showNotification("Item deleted successfully!", "success");
      setOpenDialog(false)
      fetchWishlist();
    } catch (error) {
      showNotification("Failed to remove item.", "error");
    }
  };

  const renderBody = () => {
    if (!user?.token) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-12 w-12 text-amber-400" />
          <h3 className="mt-4 text-xl font-semibold text-[#2F251F]">
            Sign in to view your wishlist
          </h3>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Save products you love and access them anytime. Tap the heart on any product to add it here.
          </p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          Fetching your saved styles...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <Heart className="h-12 w-12 text-red-400" />
          <p className="mt-4 text-sm">{error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <Heart className="h-12 w-12 text-amber-400" />
          <h3 className="mt-4 text-xl font-semibold text-[#2F251F]">
            Your wishlist is empty
          </h3>
          <p className="mt-2 max-w-md text-sm">
            Explore the latest collection and tap the heart icon to keep the styles you love at your fingertips.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => {
          const priceLabel = formatCurrency(item.price) || "Price unavailable";
          const mrpLabel = formatCurrency(item.mrp);

          return (
            <article
              key={item.id || index}
              
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => handleViewProduct(item)}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-amber-500 shadow">
                  <Heart className="h-4 w-4" onClick={()=>removeItem(item)}/>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between px-4 py-4" onClick={() => handleViewProduct(item)}>
                <div>
                  <h3 className="line-clamp-2 text-base font-semibold text-[#2F251F] group-hover:text-amber-700">
                    {item.name}
                  </h3>
                  {item.rating ? (
                    <p className="mt-2 text-xs font-medium text-gray-500">
                      {item.rating} rating
                      {item.reviews ? ` - ${item.reviews} reviews` : ""}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-[#2F251F]">
                    {priceLabel}
                  </span>
                  {mrpLabel ? (
                    <span className="text-sm text-gray-400 line-through">{mrpLabel}</span>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf7f3] py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Your saved picks
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#2F251F]">Wishlist</h1>
          <p className="mt-2 text-sm text-gray-500">
            Revisit the products you loved and make them yours.
          </p>
        </header>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
                      {items.length} items
          </h2>
          <div>
        
          {items.length > 0 && (<button
            onClick={() => setOpenDialog(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 transition"
          >
            Empty Wishlist
          </button>)}
        
          <ConfirmMassage
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleClear}
            message="Are you sure you want to clear your cart?"
          />
        </div>
        </div>
         
        {renderBody()}
      </div>
    </div>
  );
}





