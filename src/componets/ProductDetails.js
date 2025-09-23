import {React, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { BsChevronLeft } from "react-icons/bs";
import { addToCart } from "../feautres/cartSlice";
import AnimatePage from "../animation/AnimatePage";
import SizeChartModal from "./SizeChartModal";

export const ProductDetails = () => {
  const { product } = useSelector((state) => state.allCart);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  return (
    <AnimatePage>
      <SizeChartModal open={open} onClose={() => setOpen(false)} />
      <div className="bg-gray-50 py-6 font-sans">
        {product.map((data) => (
          <div className="w-full px-24 py-4 flex gap-6">
            {/* LEFT IMAGE SECTION */}
            <div className="flex gap-4 w-1/2">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 overflow-y-auto bg-gray-50">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-1 cursor-pointer border border-gray-300 hover:border-amber-800"
                  >
                    <img
                      src={data.img}
                      alt="thumb"
                      className="w-16 h-20 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 border flex items-center justify-center">
                <img
                  src={data.img}
                  alt="main"
                  className="max-h-[500px] object-contain"
                />
              </div>
            </div>




            {/* RIGHT DETAILS SECTION */}
            <div className="w-1/2 bg-gray-50 text-[#423C39] p-6 text-left">
              {/* Product Name */}
              <h2 className="text-2xl font-bold mb-2">{data.title}</h2>

              {/* Description */}
              <p className="text-sm text-[#423C39] mb-2">
                {data.description || "This is a high-quality product designed for comfort and durability."}
              </p>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-bold text-gray-800">₹2,079</span>
                  <span className="line-through text-gray-500">₹3,199</span>
                  <span className="text-green-600 font-semibold">35% off</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-amber-800 text-white px-2 py-0.5 rounded text-sm font-medium">
                  4★
                </span>
                <span className="text-sm">2,817 ratings and 179 reviews</span>
                {/* <img src="/assured.png" alt="assured" className="h-5" /> */}
              </div>



              {/* Color Options */}
              <div className="mb-4">
                <p className="font-medium mb-2 text-left">Color</p>
                <div className="flex gap-3">
                  {["Black", "Blue", "Gray"].map((color) => (
                    <button
                      key={color}
                      className="border rounded px-4 py-1 text-sm hover:border-blue-600"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Options */}
              <div className="mb-4">
                <p className="font-medium mb-2 text-left">Size</p>
                <div className="flex gap-3 flex-wrap">
                  {["28", "30", "32", "34", "36", "38"].map((size) => (
                    <button
                      key={size}
                      className="border rounded px-4 py-1 text-sm hover:border-blue-600"
                    >
                      {size}
                    </button>
                  ))}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    Size Chart
                  </span>   
                     </div>
              </div>

              {/* Offers */}
              <div className="mb-4">
                <p className="font-medium mb-2 text-left">Available offers</p>
                <ul className="list-disc list-outside pl-5 text-sm space-y-1 text-[#423C39] text-left">
                  <li>Bank Offer 10% Off on Supermoney UPI. Max discount of ₹50.</li>
                  <li>5% Cashback on Flipkart SBI Credit Card upto ₹4,000</li>
                  <li>5% Cashback on Axis Bank Flipkart Debit Card</li>
                </ul>
              </div>


              {/* Delivery */}
              <div className="mb-6 text-left">
                <p className="font-medium mb-2">Deliver to</p>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="border rounded px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
                <p className="text-sm mt-2">Expected delivery by 22 Sep, Monday</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="bg-[#423C39] text-white px-8 py-3 rounded font-semibold hover:bg-[#675e5b] transition">
                  Add to Cart
                </button>
                <button className="bg-amber-700 text-white px-8 py-3 rounded font-semibold hover:bg-amber-600 transition">
                  Buy Now
                </button>
              </div>
            </div>


          </div>

        ))}
      </div>
    </AnimatePage>
  );
};
















































// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router";
// import { BsCartPlus } from "react-icons/bs";
// import {
//   addToCart,
//   productDecrease,
//   productIncrease,
// } from "../feautres/cartSlice";
// import { BsChevronLeft } from "react-icons/bs";
// import AnimatePage from "../animation/AnimatePage";

// export const ProductDetails = () => {
//   const { product } = useSelector((state) => state.allCart);
//   console.log("product list", product);
//   const dispatch = useDispatch();
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();

//   return (
//     <AnimatePage>
//       <div className="py-6 font-['Cairo']">
//         {product.map((data) => (
//           <div
//             key={data.id}
//             className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 "
//           >
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//               <div className="flex flex-col md:flex-row -mx-4">
//                 <div className="md:flex-1 px-4">
//                   <button
//                     class="flex items-center mb-4 space-x-2 rounded-md px-4 py-2 text-gray-800 font-medium transition hover:bg-blue-500 hover:text-white"
//                     onClick={() => navigate("/")}
//                   >
//                     <span>
//                       <BsChevronLeft size={21} className="font-semibold" />
//                     </span>
//                     <span> {t("back")}</span>
//                   </button>
//                   <div className="h-80 md:h-80 rounded-lg bg-gray-100 mb-4 p-4">
//                     <div className="h-72 md:h-72 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
//                       <img src={data.img} alt="icon_product" width={280} />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:flex-1 px-4 text-left">
//                   <h2 className="mb-2 text-left leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
//                     {data.title}
//                   </h2>
//                   <p className="text-gray-500 text-sm">
//                     By{" "}
//                     <a href="/" className="text-blue-500 hover:underline">
//                       ENS Multivendor
//                     </a>
//                   </p>
//                   <div className="flex items-center space-x-4 my-4">
//                     <div>
//                       <div className="rounded-lg bg-gray-100 flex py-2 px-3">
//                         <span className="font-bold text-blue-500 text-3xl">
//                           {data.price}
//                         </span>

//                         <span className="text-indigo-400 mr-1 mt-1">
//                           ₹
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-green-500 text-xl font-semibold text-left">
//                         Save 12%
//                       </p>
//                       <p className="text-gray-400 text-sm text-left">
//                         {t("Inclusive")}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-gray-500">
//                     Lorem ipsum, dolor sit, amet consectetur adipisicing elit.
//                     Vitae exercitation porro saepe ea larum corrupting vero id
//                     laudianism enum, libero banditries expedite cuspidate a est.
//                   </p>

//                   <button
//                     onClick={() => dispatch(addToCart(data))}
//                     className="inline-flex text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="mr-2 h-6 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//                     </svg>{" "}
//                     {t("addToCart")}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </AnimatePage>
//   );
// };
