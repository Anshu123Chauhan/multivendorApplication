import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import { addToCart, productDetail } from "../feautres/cartSlice";
import { useNavigate } from "react-router";
import AnimatePage from "../animation/AnimatePage";
import { FaHeart, FaRegHeart } from "react-icons/fa";


export default function Shop() {
  const items = useSelector((state) => state.allCart.items);
  const [productFilter, setProductsFilter] = useState(items);
  const [wishlist, setWishlist] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showProductCard = (item) => {
    dispatch(productDetail(item));
    navigate("/productDetails");
  };

  const setAllCategory = () => setProductsFilter(items);

  const filterP = (cat) => {
    const result = items.filter((index) => index.category === cat);
    setProductsFilter(result);
  };

  return (
    <AnimatePage>
      <main className="flex-1 px-2 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 shadow-sm mb-3 p-2">
          {/* Title & product count */}
          <div>
            <h2 className="m-0 text-xl font-bold text-[#4B3A32]">All Products</h2>
            <p className="m-0 text-sm text-gray-500">{productFilter.length} products</p>
          </div>


          {/* Search bar */}
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

          {/* Sort dropdown */}
          <div>
            <select className="border border-gray-300 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>


        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {productFilter
            .filter((item) =>
              searchTerm === ""
                ? item
                : item.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <article
                onClick={() => showProductCard(item)}
                key={item.id}
                className="bg-white hover:shadow-md transition overflow-hidden cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative aspect-square">
                  <img
                    src={item.img}
                    alt="product_image"
                    className="h-full w-full object-cover transition-transform"
                  />

                  {/* Top Left Badge */}
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-[#423C39] text-white text-xs px-1 py-0.5 rounded">
                      {item.badge} {/* e.g. "New Arrival" / "Best Seller" / "Trending" */}
                    </span>
                  )}

                  {/* Bottom Left Rating */}
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

                  {/* Wishlist Heart (top right) */}
                  <button
                    // onClick={() => toggleWishlist(item)}
                    className="absolute top-2 right-2"
                  >
                    {wishlist.includes(item.id) ? (
                      <FaHeart className="w-5 h-5 text-[#423C39]" />
                    ) : (
                      <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-amber-800 transition" />
                    )}
                  </button>
                </div>
                {/* Content Section */}
                <div className="text-left px-2.5">
                  <p className="text-sm font-semibold text-gray-800 my-1">{item.title}</p>

                  {/* Short Description */}
                  {item.description && (
                    <p className="text-xs text-gray-500 my-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Price */}
                  <p className="my-2 text-sm font-medium text-gray-900">
                    {item.lastPrice && (
                      <span className="line-through mr-2 text-gray-500 text-xs">
                        {item.lastPrice} ₹
                      </span>
                    )}
                    {item.price} ₹
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
// import SideBar from "./SideBar";

// export default function Shop() {
//   const items = useSelector((state) => state.allCart.items);
//   const [productFilter, setProductsFilter] = useState(items);
//   const [selectValue, setSelectedValue] = useState();
//   const [searchTerm, setSearchTerm] = useState("");
//   const { t, i18n } = useTranslation();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   console.log(items);

//   /* function for button show Details product */
//   const showProductCard = (item) => {
//     dispatch(productDetail(item));
//     navigate("/productDetails");
//   };
//   const setAllCategory = () => {
//     setProductsFilter(items);
//   };
//   /* function for filter category */
//   const filterP = (cat) => {
//     const result = items.filter((index) => {
//       return index.category === cat;
//     });
//     setProductsFilter(result);
//   };

//   /* function filter data searching */
//   const handleSelectChange = (e) => {
//     const value = e.target.value;
//     setSelectedValue(value);
//     filterP(value);
//     if (value === "all") {
//       setProductsFilter(items);
//     }
//     console.log(value);
//   };

//   return (
//     <>
//       <AnimatePage>
//         <section className="bg-white py-10 text-gray-700 sm:py-16 lg:py-8 font-['Cairo'] ">
//           <div className="mx-auto max-w-screen-xl">
//             {/* form search and category components small screens */}
//             <form className="flex justify-center ml-2">
//               <select
//                 defaultValue={"all"}
//                 id="countries"
//                 onChange={handleSelectChange}
//                 className="min-[676px]:hidden bg-gray-50 font-medium border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-44 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//               >
//                 <option value="all">{t("All Products")}</option>
//                 <option value="Phones" className="px-2">
//                   {t("Phones & Tablets")}
//                 </option>
//                 <option value="Clothes"> {t("Clothes")}</option>
//                 <option value="laptop"> {t("Laptops")} </option>
//                 <option value="Accessories">{t("Accessoires")} </option>
//                 <option value="kitchen">{t("Home")} </option>
//               </select>
//               <div className="relative w-full ml-4 rounded-lg">
//                 <input
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   type="search"
//                   name="search"
//                   placeholder="Search"
//                   className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg outline-blue-600  border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
//                 />
//                 <button type="" className="absolute right-0 top-0 mt-2 mr-4">
//                   <BsSearch className="text-blue-400 w-8 h-6 top-0 left-0 mb-4" />
//                 </button>
//               </div>
//             </form>

//             {/* Side bar for category products */}
//             <SideBar filterP={filterP} setAllCategory={setAllCategory} />

//             {/* Show Data Products */}
//             <div className="mt-6 ml-56 max-[676px]:ml-3 grid grid-cols-2 gap-4 md:grid-cols-4 sm:grid-cols-3 sm:gap-1 lg:mt-6 lg:grid-cols-4 lg:gap-2">
//               {productFilter
//                 .filter((item) => {
//                   if (searchTerm === "") {
//                     return item;
//                   } else if (
//                     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//                   ) {
//                     return item;
//                   }
//                 })
//                 .map((item) => (
//                   <article
//                     key={item.id}
//                     className="bg-slate-100 p-2 rounded-md w-74 h-92 object-contain "
//                   >
//                     <div className="aspect-square overflow-hidden">
//                       <img
//                         onClick={() => {
//                           showProductCard(item);
//                         }}
//                         className="object-contain group-hover:scale-125 h-auto w-auto transition-all duration-300 cursor-pointer"
//                         src={item.img}
//                         alt="product_image"
//                       />
//                     </div>
//                     <div className="mt-2 items-start">
//                       <h3 className="cursor-pointer hover:text-blue-500 text-[18px] text-left">
//                         {item.title}
//                       </h3>

//                       <div className="text-left">
//                         <p className="inline-block text-xs font-semibold sm:text-sm md:text-base">
//                           {item.price} ₹
//                           <del className="block text-xs text-blue-400">
//                             {item.lastPrice} ₹
//                           </del>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="relative w-full h-full">
//                       <button
//                         onClick={() => dispatch(addToCart(item))}
//                         className="flex items-center justify-center sm:text-sm md:py-2 md:px-1 sm:py-2 sm:px-4 min-[319px]:py-1 text-xs min[580px]:text-xs px-2 max-[700px]:py-1  rounded-md bg-[#9333ea] text-white rounded-lg hover:bg-[#facc15] transition"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="mr-2 h-5 w-5"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//                         </svg>
//                         {t("addToCart")}
//                       </button>
//                       <ToastContainer position={"top-right"} autoClose={1000} />
//                     </div>
//                   </article>
//                 ))}
//             </div>
//           </div>
//         </section>
//       </AnimatePage>
//     </>
//   );
// }
