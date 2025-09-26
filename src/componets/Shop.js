import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import { addToCart, productDetail } from "../feautres/cartSlice";
import { useNavigate } from "react-router";
import AnimatePage from "../animation/AnimatePage";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductsFilter] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/ecommerce/product/listing", {
        // Body can be empty for now or add filters if needed
      });
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
    console.log("ooooooooooooooooo",item._id)
    dispatch(productDetail(item));
    navigate(`/product/${item._id}`);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const filterP = (cat) => {
    const result = products.filter((item) => item.category === cat);
    setProductsFilter(result);
  };

  const setAllCategory = () => setProductsFilter(products);

  return (
    <AnimatePage>
      <main className="flex-1 px-2 bg-white">
        {/* Header, Search, and Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 shadow-sm mb-3 p-2">
          <div>
            <h2 className="m-0 text-xl font-bold text-[#4B3A32]">All Products</h2>
            <p className="m-0 text-sm text-gray-500">{productFilter.length} products</p>
          </div>

          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Search"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <BsSearch className="text-[#4B3A32] w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <select className="border border-gray-300 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {productFilter
            .filter((item) =>
              searchTerm === ""
                ? item
                : item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <article
                onClick={() => showProductCard(item)}
                key={item._id}
                className="bg-white hover:shadow-md transition overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform"
                  />

                  {item.rating && (
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/80 px-1 py-0.5 rounded">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={`text-xs ${index < item.rating ? "text-amber-700" : "text-gray-300"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    className="absolute top-2 right-2"
                    onClick={() => toggleWishlist(item._id)}
                  >
                    {wishlist.includes(item._id) ? (
                      <FaHeart className="w-5 h-5 text-[#37312F]" />
                    ) : (
                      <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-amber-800 transition" />
                    )}
                  </button>
                </div>

                <div className="text-left ">
                  <p className="text-sm font-semibold text-gray-800 my-1">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 my-1 line-clamp-2">{item.description}</p>
                  )}
                  <p className="my-2 text-sm font-medium text-gray-900">
                    {item.mrp && (
                      <span className="line-through mr-2 text-gray-500 text-xs">
                        {item.mrp} ₹
                      </span>
                    )}
                    {item.sellingPrice} ₹
                  </p>
                  <ToastContainer position="top-right" autoClose={1000} />
                </div>
              </article>
            ))}
        </div>
      </main>
    </AnimatePage>
  );
}


































// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { BsSearch } from "react-icons/bs";
// import { ToastContainer } from "react-toastify";
// import { addToCart, productDetail } from "../feautres/cartSlice";
// import { useNavigate } from "react-router";
// import AnimatePage from "../animation/AnimatePage";
// import { FaHeart, FaRegHeart } from "react-icons/fa";


// export default function Shop() {
//   const items = useSelector((state) => state.allCart.items);
//   const [productFilter, setProductsFilter] = useState(items);
//   const [wishlist, setWishlist] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const { t } = useTranslation();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const showProductCard = (item) => {
//     dispatch(productDetail(item));
//     navigate("/productDetails");
//   };

//   const setAllCategory = () => setProductsFilter(items);

//   const filterP = (cat) => {
//     const result = items.filter((index) => index.category === cat);
//     setProductsFilter(result);
//   };

//   return (
//     <AnimatePage>
//       <main className="flex-1 px-2 bg-white">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 shadow-sm mb-3 p-2">
//           {/* Title & product count */}
//           <div>
//             <h2 className="m-0 text-xl font-bold text-[#4B3A32]">All Products</h2>
//             <p className="m-0 text-sm text-gray-500">{productFilter.length} products</p>
//           </div>


//           {/* Search bar */}
//           <div className="w-full md:w-1/3">
//             <div className="relative">
//               <input
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 type="search"
//                 placeholder="Search"
//                 className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 <BsSearch className="text-[#4B3A32] w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Sort dropdown */}
//           <div>
//             <select className="border border-gray-300 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500">
//               <option>Sort by: Recommended</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//             </select>
//           </div>
//         </div>


//         {/* Product grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
//           {productFilter
//             .filter((item) =>
//               searchTerm === ""
//                 ? item
//                 : item.title
//                   .toLowerCase()
//                   .includes(searchTerm.toLowerCase())
//             )
//             .map((item) => (
//               <article
//                 onClick={() => showProductCard(item)}
//                 key={item.id}
//                 className="bg-white hover:shadow-md transition overflow-hidden cursor-pointer"
//               >
//                 {/* Image Section */}
//                 <div className="relative aspect-square">
//                   <img
//                     src={item.img}
//                     alt="product_image"
//                     className="h-full w-full object-cover transition-transform"
//                   />

//                   {/* Top Left Badge */}
//                   {item.badge && (
//                     <span className="absolute top-2 left-2 bg-[#37312F] text-white text-xs px-1 py-0.5 rounded">
//                       {item.badge} {/* e.g. "New Arrival" / "Best Seller" / "Trending" */}
//                     </span>
//                   )}

//                   {/* Bottom Left Rating */}
//                   {item.rating && (
//                     <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/80 px-1 py-0.5 rounded">
//                       {Array.from({ length: 5 }).map((_, index) => (
//                         <span
//                           key={index}
//                           className={`text-xs ${index < item.rating ? "text-amber-700" : "text-gray-300"
//                             }`}
//                         >
//                           ★
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   {/* Wishlist Heart (top right) */}
//                   <button
//                     // onClick={() => toggleWishlist(item)}
//                     className="absolute top-2 right-2"
//                   >
//                     {wishlist.includes(item.id) ? (
//                       <FaHeart className="w-5 h-5 text-[#37312F]" />
//                     ) : (
//                       <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-amber-800 transition" />
//                     )}
//                   </button>
//                 </div>
//                 {/* Content Section */}
//                 <div className="text-left px-2.5">
//                   <p className="text-sm font-semibold text-gray-800 my-1">{item.title}</p>

//                   {/* Short Description */}
//                   {item.description && (
//                     <p className="text-xs text-gray-500 my-1 line-clamp-2">
//                       {item.description}
//                     </p>
//                   )}

//                   {/* Price */}
//                   <p className="my-2 text-sm font-medium text-gray-900">
//                     {item.lastPrice && (
//                       <span className="line-through mr-2 text-gray-500 text-xs">
//                         {item.lastPrice} ₹
//                       </span>
//                     )}
//                     {item.price} ₹
//                   </p>

//                   <ToastContainer position="top-right" autoClose={1000} />
//                 </div>

//               </article>

//             ))}
//         </div>
//       </main>
//     </AnimatePage>
//   );
// }

