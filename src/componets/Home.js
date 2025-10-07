import React, { useEffect, useState } from "react";
// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import HeroBanner from "./HeroBanner";
import axios from "axios";
import { apiurl } from "../config/config";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import OffersBanner from "./OffersBanner";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x800.png?text=ENS";

const getNumericValue = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const pickFirstNumeric = (...values) => {
  for (const value of values) {
    const numeric = getNumericValue(value);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
};

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : null;
  }
  return null;
};

const getCreatedTimestamp = (product) => {
  const fields = [
    product?.createdAt,
    product?.updatedAt,
    product?.publishedAt,
    product?.createdOn,
    product?.addedAt,
  ];

  for (const field of fields) {
    const parsed = parseDateValue(field);
    if (parsed !== null) {
      return parsed;
    }
  }

  return 0;
};

const getSaleScore = (product) => {
  const fields = [
    product?.sold,
    product?.salesCount,
    product?.totalOrders,
    product?.orderCount,
    product?.popularity,
    product?.quantitySold,
  ];

  for (const field of fields) {
    const numeric = getNumericValue(field);
    if (numeric !== null) {
      return numeric;
    }
  }

  return 0;
};

const extractImageFromEntry = (entry) => {
  if (!entry) {
    return null;
  }
  if (typeof entry === "string") {
    return entry.trim() ? entry : null;
  }
  if (typeof entry === "object") {
    return (
      entry.url ??
      entry.src ??
      entry.secure_url ??
      entry.Location ??
      entry.location ??
      entry.imageUrl ??
      entry.preview ??
      null
    );
  }
  return null;
};

const resolvePrimaryImage = (product) => {
  const candidates = [];

  if (product?.thumbnail) candidates.push(product.thumbnail);
  if (product?.image) candidates.push(product.image);
  if (product?.featuredImage) candidates.push(product.featuredImage);
  if (Array.isArray(product?.images)) {
    candidates.push(...product.images);
  }

  if (Array.isArray(product?.variants)) {
    for (const variant of product.variants) {
      if (variant?.isDeleted) continue;
      if (variant?.thumbnail) candidates.push(variant.thumbnail);
      if (Array.isArray(variant?.images)) {
        candidates.push(...variant.images);
      }
    }
  }

  for (const entry of candidates) {
    const image = extractImageFromEntry(entry);
    if (image) {
      return image;
    }
  }

  return FALLBACK_IMAGE;
};

const derivePrice = (product) => {
  const directPrice = pickFirstNumeric(
    product?.price?.max,
    product?.price?.value,
    product?.price?.min,
    product?.sellingPrice,
    product?.currentPrice,
    product?.price
  );

  if (directPrice !== null) {
    return directPrice;
  }

  if (Array.isArray(product?.variants)) {
    for (const variant of product.variants) {
      if (variant?.isDeleted) continue;
      const variantPrice = pickFirstNumeric(
        variant?.price?.max,
        variant?.price?.value,
        variant?.price?.min,
        variant?.sellingPrice,
        variant?.currentPrice,
        variant?.price
      );
      if (variantPrice !== null) {
        return variantPrice;
      }
    }
  }

  return null;
};

const formatCurrency = (value) => {
  const numeric = getNumericValue(value);
  if (numeric === null) {
    return null;
  }

  return numeric.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const mapProductForDisplay = (product, tag, index) => {
  const priceValue = derivePrice(product);
  const productId =
    product?._id ??
    product?.id ??
    product?.slug ??
    product?.productId ??
    product?.sku ??
    `${tag}-${index}`;

  return {
    id: String(productId),
    name: product?.name ?? product?.title ?? "Product",
    price: priceValue !== null ? formatCurrency(priceValue) : null,
    image: resolvePrimaryImage(product),
    tag,
  };
};

export default function HeroPage() {

  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState("BESTSELLER");

  useEffect(() => {
    let isMounted = true;

    const fetchHomeProducts = async () => {
      if (!isMounted) {
        return;
      }

      setIsLoadingProducts(true);

      try {
        const response = await axios.post(`${apiurl}/ecommerce/product/listing`, {});
        const serverProducts = Array.isArray(response?.data?.products)
          ? response.data.products
          : [];

        const availableProducts = serverProducts.filter(
          (product) => product && !product?.isDeleted
        );

        const sanitizedProducts =
          availableProducts.length > 0 ? availableProducts : serverProducts;

        if (!isMounted) {
          return;
        }

        if (sanitizedProducts.length === 0) {
          setNewProducts([]);
          setBestsellerProducts([]);
          return;
        }

        const sortedByDate = [...sanitizedProducts].sort(
          (a, b) => getCreatedTimestamp(b) - getCreatedTimestamp(a)
        );

        const latestProducts = sortedByDate.slice(0, 4);
        const latestIds = new Set(
          latestProducts
            .map((product) => product?._id ?? product?.id)
            .filter(Boolean)
        );

        const remainingProducts = sortedByDate.filter((product) => {
          const identifier = product?._id ?? product?.id;
          return identifier ? !latestIds.has(identifier) : true;
        });

        const bestSource =
          remainingProducts.length >= 4 ? remainingProducts : sortedByDate;

        const bestCandidates = [...bestSource]
          .sort((a, b) => getSaleScore(b) - getSaleScore(a))
          .slice(0, 4);

        if (!isMounted) {
          return;
        }

        setNewProducts(
          latestProducts.map((product, index) =>
            mapProductForDisplay(product, "NEW", index)
          )
        );
        setBestsellerProducts(
          bestCandidates.map((product, index) =>
            mapProductForDisplay(product, "BEST SELLER", index)
          )
        );
      } catch (error) {
        console.error("Error fetching home products:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchHomeProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const products =
    activeTab === "BESTSELLER" ? bestsellerProducts : newProducts;
  const items = [
    "https://images.unsplash.com/photo-1610555423081-85ec0b8eabac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673977134363-c86a9d5dcafa?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1673977134363-c86a9d5dcafa?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1690349404224-53f94f20df8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1714729382668-7bc3bb261662?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const blogs = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1708632849280-366c31b3f26f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "5 Ways to Wear Shirts with Denims And Style It Right",
      desc: "Denims in the Workplace? Absolutely. Long gone are the days when men's jeans were reserved...",
    },
    {
      image:
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop",
      title: "The Best Men’s Outfits for Onam 2025",
      desc: "Onam feels more than just any festival. It’s a time to gather with loved ones, relive traditions,...",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1681486655320-af09026a2307?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "What to Wear to a Monsoon Office Party?",
      desc: "If you’ve ever stood in front of your wardrobe on a rainy weekday wondering, “What exactly counts...",
    },
  ];

  return (
    <>
      <HeroBanner />
      
      <OffersBanner />

      <div className="bg-gray-50 py-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs text-[#37312F] tracking-widest uppercase">
            Here for you
          </p>
          <div className="flex justify-center space-x-10 mt-3">
            <button
              onClick={() => setActiveTab("BESTSELLER")}
              className={`text-xl font-medium pb-1 transition ${activeTab === "BESTSELLER"
                  ? "border-b-2 border-gray-900 text-[#37312F]"
                  : "text-gray-500 hover:text-amber-800"
                }`}
            >
              BESTSELLER
            </button>
            <button
              onClick={() => setActiveTab("NEW")}
              className={`text-xl font-medium pb-1 transition ${activeTab === "NEW"
                  ? "border-b-2 border-gray-900 text-[#37312F]"
                  : "text-gray-500 hover:text-amber-800"
                }`}
            >
              THIS IS NEW
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-full mx-auto px-10 sm:px-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoadingProducts ? (
            <p className="col-span-full text-center text-sm text-gray-500">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-500">
              Products coming soon.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden transition"
              >
                {/* Image Section */}
                <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.tag && (
                    <span className="absolute bottom-2 right-2 bg-amber-800 text-white text-[10px] px-1 py-[2px] rounded-md shadow">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="py-2 text-left">
                  <p className="text-lg font-medium text-gray-700">
                    {product.name}
                  </p>

                  <p className="text-lg font-semibold truncate leading-none text-[#2F251F] mb-0">
                    {product.price ?? "Price unavailable"}
                  </p>
                </div>
                </Link>
              </div>
            ))
          )}

        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-2">
          <button className="mt-10 bg-[#37312F] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
            VIEW ALL
          </button>
        </div>
      </div>



      <section className="max-w-full mx-auto px-10 sm:px-24 py-12 font-nunito">
        {/* Heading */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
            HOT RIGHT NOW
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Our Favourite Categories You Should Own Right Away!
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left big image */}
          <div className="relative group h-[700px]">
            <img
              src="https://plus.unsplash.com/premium_photo-1691367279403-aaa787d264f6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Linen Shirts"
              className="w-full h-full object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 text-white text-lg font-semibold">
              LINEN SHIRTS
            </span>
          </div>

          {/* Right stacked images */}
          <div className="grid grid-rows-2 gap-6">
            <div className="relative group h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1587775100148-028f29e921cd?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sunglasses"
                className="w-full h-full object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                SUNGLASSES
              </span>
            </div>
            <div className="relative group h-[340px]">
              <img
                src="https://plus.unsplash.com/premium_photo-1690034979506-cf086f51bd58?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Blazers"
                className="w-full h-full object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                BLAZERS
              </span>
            </div>
          </div>
        </div>
      </section>



      <section className="bg-gray-100 py-14 font-nunito">
        <div className="max-w-full mx-auto px-10 sm:px-24 text-center">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold mb-3 font-nunito">
            Trendy T-Shirts <span className="font-bold">Starting @ ₹1299</span>
          </h2>
          <p className="text-gray-600 text-base md:text-base mb-5">
            Refresh your wardrobe with the latest styles in premium comfort.
          </p>
          {/* Swiper Carousel */}
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={3000}
            loop={true}
            slidesPerView={1.2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4.2 },
            }}
          >
            {items.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-[420px] flex-shrink-0">
                  <img
                    src={src}
                    alt={`T-shirt ${i + 1}`}
                    className="w-full h-full object-cover shadow-md hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Button */}
          <button className="mt-10 bg-[#37312F] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
            BUY NOW
          </button>
        </div>
      </section>



        <section className="bg-gray-100 py-8">
      <div className="w-full mx-auto px-10 sm:px-24 text-center">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
          News
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-nunito">
          FROM THE BLOG
        </h2>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {blogs.map((blog, index) => (
            <div key={index}>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="py-4 text-left">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {blog.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
          <button className="mt-10 bg-[#37312F] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
          VIEW ALL
        </button>
      </div>
    </section>
    </>

  );
}
