import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag } from "lucide-react";
import ProfilePopup from "../reusableComponent/ProfilePopup";
import MenCollections from "./MenCollections";

export default function Header({ isShopPage }) {
  const [menuHovered, setMenuHovered] = useState(null); // for MEN/WOMEN etc
  const [searchHovered, setSearchHovered] = useState(false); // for search input
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
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isShopPage]);

  return (
    <div
      className={`top-0 left-0 w-full z-50 transition-colors duration-500 ${isShopPage
        ? "bg-[#37312F] shadow-md relative"
        : `fixed ${isScrolled ? "bg-[#37312F] shadow-md" : "bg-transparent"}`
        }`}
    >
      <div className="flex justify-between items-center px-10 py-6">
        {/* Brand */}
        <div className="font-nunito text-2xl font-bold text-white">
          ENS ENTERPRISES
        </div>

        {/* Links */}
        <div className="flex space-x-8 text-sm font-medium">
          {/* MEN with popup */}
          {/* <div
            className="relative"
            onMouseEnter={() => setMenuHovered("men")}
            onMouseLeave={() => setMenuHovered(null)}
          >
            <Link
              to="/shop"
              className="font-nunito hover:text-amber-800 transition"
            >
              MEN
            </Link>
            {menuHovered === "men" && <MenCollections />}
          </div> */}
          <MenCollections />

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
        </div>

        {/* Icons */}
        <div className="flex space-x-6">
          <div
            className="flex items-center relative group"
            onMouseEnter={() => setSearchHovered(true)}
            onMouseLeave={() => setSearchHovered(false)}
          >
            {/* Search Icon (hide on hover) */}
            {!searchHovered && (
              <Search className="text-white w-5 h-5 mb-3 cursor-pointer hover:text-amber-800" />
            )}

            {/* Animated Input */}
            <motion.input
              type="text"
              placeholder="Search"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: searchHovered ? 180 : 0,
                opacity: searchHovered ? 1 : 0,
                marginLeft: searchHovered ? 8 : 0,
              }}
              transition={{ duration: 0.5 }}
              className="h-8 w-60 border-b-2 border-gray-400 text-white px-2 focus:outline-none placeholder-gray-300 bg-[#4e4848]"
            />
          </div>

          <ProfilePopup />
          <Heart className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
          <Link to="/checkout">
            <ShoppingBag className="text-white w-5 h-5 cursor-pointer hover:text-amber-800" />
          </Link>
        </div>
      </div>
    </div>
  );
}
