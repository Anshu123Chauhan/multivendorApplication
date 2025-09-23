import React, { useState } from "react";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import OffersBanner from "./OffersBanner";
export default function HeroPage() {

  const bestsellerProducts = [
    {
      id: 1,
      name: "Off White Crew Neck Solid Sweatshirt",
      price: "₹ 2,599",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=783&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "BEST SELLER",
    },
    {
      id: 3,
      name: "Black Crew Neck Solid T-Shirt - Roxx",
      price: "₹ 1,499",
      image:
        "https://plus.unsplash.com/premium_photo-1673977133155-3b738590d58e?q=80&w=690&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "BEST SELLER",
    },
    {
      id: 2,
      name: "White Crew Neck Solid T-Shirt - Fly",
      price: "₹ 1,499",
      image:
        "https://plus.unsplash.com/premium_photo-1671576642314-11a11284ea36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "BEST SELLER",
    },
    {
      id: 4,
      name: "Black Crew Neck Solid T-Shirt - Zoro",
      price: "₹ 1,499",
      image:
        "https://plus.unsplash.com/premium_photo-1673977132933-2a028c2f05a8?q=80&w=679&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "BEST SELLER",
    },
  ];

  const newProducts = [
    {
      id: 5,
      name: "Blue Slim Fit Casual Shirt",
      price: "₹ 1,899",
      image:
        "https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "NEW",
    },
    {
      id: 6,
      name: "Olive Green Polo T-Shirt",
      price: "₹ 1,299",
      image:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tag: "NEW",
    },
  ];

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

  const [activeTab, setActiveTab] = useState("BESTSELLER");
  const products =
    activeTab === "BESTSELLER" ? bestsellerProducts : newProducts;

  return (
    <>
      <div className="relative w-full h-screen bg-gray-900 text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <video
            src="https://cdn.pixabay.com/video/2015/11/10/1309-145351537_medium.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative flex flex-col items-center justify-end h-full z-10 pb-20">
          <h2 className="text-4xl mb-4 font-nunito">NEW FOR YOU</h2>
          <div className="flex space-x-6">
            <button className="font-nunito bg-[#423C39] text-white px-6 py-1 rounded-lg shadow-lg hover:bg-white hover:!text-black transition-colors duration-300">
              FORMALS
            </button>
            <button className="font-nunito bg-[#423C39] text-white px-6 py-1 rounded-lg shadow-lg hover:bg-white hover:!text-black transition-colors duration-300">
              CASUALS
            </button>
          </div>
        </div>

      </div>
      
      <OffersBanner />

      <div className="bg-gray-50 py-14">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs text-[#423C39] tracking-widest uppercase">
            Here for you
          </p>
          <div className="flex justify-center space-x-10 mt-3">
            <button
              onClick={() => setActiveTab("BESTSELLER")}
              className={`text-xl font-medium pb-1 transition ${activeTab === "BESTSELLER"
                  ? "border-b-2 border-gray-900 text-[#423C39]"
                  : "text-gray-500 hover:text-amber-800"
                }`}
            >
              BESTSELLER
            </button>
            <button
              onClick={() => setActiveTab("NEW")}
              className={`text-xl font-medium pb-1 transition ${activeTab === "NEW"
                  ? "border-b-2 border-gray-900 text-[#423C39]"
                  : "text-gray-500 hover:text-amber-800"
                }`}
            >
              THIS IS NEW
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-full mx-auto px-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden transition"
            >
              {/* Image Section */}
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
                <p className="text-[13px] font-medium text-gray-700">
                  {product.name}
                </p>

                <p className="text-[12px] font-semibold truncate leading-none">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button className="mt-10 bg-[#423C39] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
            VIEW ALL
          </button>
        </div>
      </div>



      <section className="max-w-full mx-auto px-24 py-12 font-nunito">
        {/* Heading */}
        <div className="text-center mb-10">
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
        <div className="max-w-full mx-auto px-24 text-center">
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
          <button className="mt-10 bg-[#423C39] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
            BUY NOW
          </button>
        </div>
      </section>



        <section className="bg-gray-100 py-8">
      <div className="w-full mx-auto px-24 text-center">
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
          <button className="mt-10 bg-[#423C39] text-white px-8 py-3 rounded-md hover:bg-amber-800 transition">
          VIEW ALL
        </button>
      </div>
    </section>
    </>

  );
}
