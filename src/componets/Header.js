import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingBag } from "lucide-react";

export default function Header({ isShopPage }) {
  const [hovered, setHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    if (!isShopPage) {
      // shop page par scroll event ki zarurat nahi
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isShopPage]);

  return (
    <div
      className={`top-0 left-0 w-full z-50 transition-colors duration-500 ${
        isShopPage
          ? "bg-[#423C39] shadow-md relative" // shop page → permanent background
          : `fixed ${isScrolled ? "bg-[#423C39] shadow-md" : "bg-transparent"}`
      }`}
    >
      <div className="flex justify-between items-center px-10 py-6">
        {/* Brand */}
        <div className="font-nunito text-2xl font-bold text-white">
          ENS ENTERPRISES
        </div>

        {/* Links */}
        <div className="flex space-x-8 text-sm font-medium">
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            MEN
          </Link>
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            WOMEN
          </Link>
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            KIDS
          </Link>
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            HOME
          </Link>
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            BEAUTY
          </Link>
          <Link to="/shop" className="font-nunito hover:text-amber-800 transition">
            ELECTRONICS
          </Link>
          {/* <Link to="/contactUs" className="font-nunito hover:text-amber-800 transition">
            SERVICE CLIENT
          </Link>
          <Link to="/sellerRegister" className="font-nunito hover:text-amber-800 transition">
            BECOME A SELLER
          </Link> */}
         
        </div>

        {/* Icons */}
        <div className="flex space-x-6">
    <div
      className="flex items-center relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Search Icon (hide on hover) */}
      {!hovered && (
        <Search className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
      )}

      {/* Animated Input */}
   <motion.input
  type="text"
  placeholder="Search"
  initial={{ width: 0, opacity: 0 }}
  animate={{
    width: hovered ? 180 : 0,
    opacity: hovered ? 1 : 0,
    marginLeft: hovered ? 8 : 0,
  }}
  transition={{ duration: 0.5 }}
  className="h-8 w-60 border-b-2 border-gray-400 text-white px-2 focus:outline-none placeholder-gray-300 bg-[#4e4848]"
/>

    </div> 
            <User className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
          <Heart className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
          <ShoppingBag className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
        </div>
      </div>
    </div>
  );
}






























































































// import React, { useState, useEffect } from "react";
// import "./css_files/Header.css";
// import Logo from "../images/logo.png";
// import { BsPersonPlusFill, BsPersonFill } from "react-icons/bs";
// import { FiSettings, FiSearch } from "react-icons/fi";
// import { RiShareForward2Line } from "react-icons/ri";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUserName, setLogOut } from "../feautres/userSlice";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// function Header() {
//   const { t, i18n } = useTranslation();
//   const { cart } = useSelector((state) => state.allCart);
//   const [open, setOpen] = useState(false);
//   const userName = useSelector(selectUserName);
//   const [photo, setPhoto] = useState();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleOpen = () => {
//     setOpen(!open);
//   };

//   const logOut = () => {
//     signOut(auth)
//       .then(() => {
//         dispatch(setLogOut());
//       })
//       .catch((err) => alert(err.message));
//   };

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log("photo", user.photoURL);
//         setPhoto(user.photoURL);
//         const name = user.displayName;
//         const email = user.email;
//         const icon = user.photoURL;
//         localStorage.setItem("name", name);
//         localStorage.setItem("email", email);
//         localStorage.setItem("photo", icon);
//       }
//     });
//   }, []);
//   return (
//     <nav className="bg-[#facc15]">
//       <input id="nav-toggle" type="checkbox" />
//       <div className="logo">
//         <img src={Logo} alt="image_logo" onClick={() => navigate("/")} />
//       </div>
//       <ul className="links">
//         <li>
//           {" "}
//           <NavLink to="/shop" exact="true" active="true">
//            Shop
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/contactUs" exact="true" active="true">
//             Service Client
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/sellerRegister" exact="true" active="true">
//             Become a Seller
//           </NavLink>
//         </li>
        
//       </ul>
//       <div className="icons font-bold flex mt-[21px] relative">
//         <NavLink active="true" exact="true" className="hover:text-black">
//           <div className="text-center font-mono">
//             <button onClick={handleOpen}>
//               {" "}
//               {userName ? (
//                 <img
//                   alt="user"
//                   src={photo}
//                   width={38}
//                   className="rounded-[50%] text-xs"
//                 />
//               ) : (
//                 <BsPersonPlusFill size={32} className="text-white" />
//               )}
//             </button>
//             {open ? (
//               <div className="absolute text-[18px] right-6 mt-[28px] z-50 w-48 h-70 p-2 bg-white rounded-2xl font-['Cairo']">
//                 <Link
//                   to="/login"
//                   className="inline-flex text-gray-600 hover:bg-grey-lighter"
//                 >
//                   {userName != null ? (
//                     <Link to="/account">hi, {userName}</Link>
//                   ) : (
//                     <Link
//                       to="/login"
//                       className="flex px-2 py-2 text-gray-600 hover:bg-grey-lighter"
//                     >
//                       Login
//                     </Link>
//                   )}
//                 </Link>
//                 <hr className="border-t mx-2 border-grey-light" />
//                 <Link
//                   to="/account"
//                   className="flex px-4 py-2  text-gray-600 hover:bg-grey-lighter"
//                 >
//                   <BsPersonFill className="mr-2" size={26} />
//                   Profile
//                 </Link>
//                 <Link
//                   to="/account"
//                   className="px-4 py-2 flex  text-gray-600 hover:bg-grey-lighter"
//                 >
//                   <FiSettings className="mr-2" size={24} />
//                   setting
//                 </Link>
//                 <hr className="border-t mx-2 border-grey-light" />
//                 <button
//                   onClick={logOut}
//                   className="px-9 py-2 flex text-gray-600 hover:bg-grey-lighter"
//                 >
//                   Logout
//                   <RiShareForward2Line className="ml-4" size={25} />
//                 </button>
//               </div>
//             ) : null}
//           </div>
//         </NavLink>
//         <NavLink
//           to="/Card"
//           active="true"
//           exact="true"
//           className="items-center ml-8"
//         >
//           <div className="relative scale-75">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="h-10 w-10 text-white"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
//               />
//             </svg>
//             <span className="absolute -top-3 left-4 rounded-full bg-red-500 p-0.5 px-2 text-sm text-red-50">
//               {cart.length}
//             </span>
//           </div>
//         </NavLink>
//       </div>
//       <label htmlFor="nav-toggle" className="icon-burger">
//         <div className="line"></div>
//         <div className="line"></div>
//         <div className="line"></div>
//       </label>
//     </nav>
//   );
// }

// export default Header;
