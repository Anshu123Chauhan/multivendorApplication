import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import ProfilePopup from "../reusableComponent/ProfilePopup";
import { useCartWishlist } from "../context/CartWishlistContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Men", to: "/shop" },
  { label: "Women", to: "/shop" },
  { label: "Kids", to: "/shop" },
  { label: "Beauty", to: "/shop" },
  { label: "Electronics", to: "/shop" },
];

export default function Header({ isShopPage }) {
  const { cartCount, wishlistCount } = useCartWishlist();
  const displayCartCount = cartCount > 99 ? "99+" : cartCount;
  const displayWishlistCount = wishlistCount > 99 ? "99+" : wishlistCount;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState("");

// Function to handle search
const handleSearch = async () => {
  if (!searchQuery.trim()) return; // Do nothing if empty
  navigate("/search", { state: { query: searchQuery } });
};

  useEffect(() => {
    if (isShopPage) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isShopPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobileMenuOpen]);

  const mobileLinks = [{ label: "Men", to: "/shop" }, ...navLinks];

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchBlur = () => {
    setIsSearchOpen(false);
  };

  const headerClasses = `top-0 left-0 w-full z-50 transition-colors duration-500 ${isShopPage
      ? "bg-[#37312F] shadow-md relative"
      : `fixed ${isScrolled ? "bg-[#37312F] shadow-md" : "bg-transparent"}`
    }`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
        <Link
          to="/"
          className="font-nunito text-xl font-bold tracking-wide text-white sm:text-2xl"
        >
          ENS
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white lg:flex">
          {/* <MenCollections /> */}
          {navLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="uppercase tracking-wide transition hover:text-amber-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-white sm:gap-3">
          <div
            className="relative hidden items-center md:flex"
            onMouseEnter={() => setIsSearchOpen(true)}
            onMouseLeave={() => setIsSearchOpen(false)}
          >
            <motion.input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: isSearchOpen ? 1 : 0,
                opacity: isSearchOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
              className="h-9 rounded-full border border-white/40 bg-white/10 px-3 text-sm text-white placeholder-white/70 outline-none backdrop-blur origin-left"
            />

            <button
              type="button"
              onClick={handleSearch}
              aria-label="Search"
              className="rounded-full p-2 text-white transition-colors hover:text-amber-300"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>


          <ProfilePopup />

          <Link
            to="/wishlist"
            className="relative rounded-full overflow-hidden p-2 text-white transition-colors hover:text-amber-300"
            aria-label={
              `View wishlist (${wishlistCount || 0} items)`
            }
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 ? (
              <span className="absolute top-[2px] right-[5px] h-[15px] w-[15px] text-center overflow-hidden rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-4 text-white">
                {displayWishlistCount}
              </span>
            ) : null}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-full overflow-hidden p-2 text-white transition-colors hover:text-amber-300"
            aria-label={
              `View cart (${cartCount || 0} items)`
            }
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute top-[2px] right-[5px] h-[15px] w-[15px] text-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-4 text-white">
                {displayCartCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="rounded-full p-2 text-white transition-colors hover:text-amber-300 lg:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#37312F] lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-6 text-sm font-medium text-white">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-white/70" />
              <input
                type="text"
                placeholder="Search for products"
                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
              />
            </div>

            {mobileLinks.map(({ label, to }) => (
              <Link
                key={`mobile-${label}`}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="uppercase tracking-wide transition hover:text-amber-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}






