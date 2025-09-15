import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import { addToCart, productDetail } from "../feautres/cartSlice";
import { useNavigate } from "react-router";
import AnimatePage from "../animation/AnimatePage";
import SideBar from "./SideBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Home() {
  const items = useSelector((state) => state.allCart.items);
  const [productFilter, setProductsFilter] = useState(items);
  const [selectValue, setSelectedValue] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(items);



  const setAllCategory = () => {
    setProductsFilter(items);
  };
  /* function for filter category */
  const filterP = (cat) => {
    const result = items.filter((index) => {
      return index.category === cat;
    });
    setProductsFilter(result);
  };

  /* function filter data searching */
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    filterP(value);
    if (value === "all") {
      setProductsFilter(items);
    }
    console.log(value);
  };


  const showProductCard = (item) => {
    dispatch(productDetail(item));
    navigate("/productDetails");
  };

    const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  return (
    <AnimatePage>
      <div className="font-['Cairo']">
        {/* Hero Section */}
        
           <section className="relative bg-[#9333ea] text-white py-24">
            <div className="max-w-screen-xl mx-auto px-6 text-center flex">
            <div className="w-1/2 p-5">

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to <span className="text-yellow-300">MyStore</span>
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Find the best deals on Electronics, Fashion, and Accessories.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition"
              >
                Shop Now
              </button>
            </div>
            <div className="w-1/2">
            <Slider {...settings}>
              <img src="https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e" className="h-[400px] h-[400px] rounded-[30px] shadow-md"/> 
              <img src="https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e" className="h-[400px] h-[400px] rounded-[30px] shadow-md"/> 
              <img src="https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e" className="h-[400px] h-[400px] rounded-[30px] shadow-md"/> 
            </Slider>
            </div>
            </div>
          </section>
     

        {/* Categories Section */}
        <section className="py-10 bg-gray-100">
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold pb-10">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-[0px_10px_10px_#facc15] hover:shadow-[0px_1px_20px_#facc15] cursor-pointer transition-shadow duration-300 transform hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                  alt="Phones"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">Phones</h3>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-[0px_10px_10px_#facc15] hover:shadow-[0px_1px_20px_#facc15] cursor-pointer transition-shadow duration-300 transform hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f"
                  alt="Laptops"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">Laptops</h3>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-[0px_10px_10px_#facc15] hover:shadow-[0px_1px_20px_#facc15] cursor-pointer transition-shadow duration-300 transform hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe"
                  alt="Clothes"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">Clothes</h3>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-[0px_10px_10px_#facc15] hover:shadow-[0px_1px_20px_#facc15] cursor-pointer transition-shadow duration-300 transform hover:scale-105">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e"
                  alt="Accessories"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold">Accessories</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-10">
          <div className="max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center pb-10">
              Featured Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productFilter.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg p-4 text-center"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    onClick={() => showProductCard(item)}
                    className="h-40 w-full object-contain cursor-pointer mb-4"
                  />
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-700 font-bold">
                    {item.price} ₹{" "}
                    <br/>
                    <del className="text-sm text-gray-400">{item.lastPrice} ₹</del>
                  </p>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="mt-3 px-4 py-2 bg-[#9333ea] text-white rounded-lg hover:bg-[#facc15] transition"
                  >
                    Add to Cart
                  </button>
                  <ToastContainer position="top-right" autoClose={1000} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold pb-10">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow">
                <p className="italic">
                  "Amazing products, fast delivery, and great customer support!"
                </p>
                <h4 className="mt-4 font-semibold">— Sarah M.</h4>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <p className="italic">
                  "I always find the best deals here. Highly recommend!"
                </p>
                <h4 className="mt-4 font-semibold">— David R.</h4>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <p className="italic">
                  "Excellent quality and very user-friendly website."
                </p>
                <h4 className="mt-4 font-semibold">— Priya K.</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade Your Lifestyle?
          </h2>
          <p className="mb-8">
            Shop the latest products at unbeatable prices. Don’t miss out!
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition"
          >
            Start Shopping
          </button>
        </section>
      </div>
    </AnimatePage>
  );
}
