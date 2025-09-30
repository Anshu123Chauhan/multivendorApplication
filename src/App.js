import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Header from "./componets/Header";
import Contact from "./componets/Contact";
import Cart from "./componets/Cart";
import PageNotFount from "./reusableComponent/PageNotFound";
import Footer from "./componets/Footer";
import Home from "./componets/Home";
import Shop from "./componets/Shop";
import Login from "./componets/Login";
import Account from "./componets/Account";
import { ProductDetails } from "./componets/ProductDetails";
import Confirmation from "./componets/Confirmation.jsx";
import SellerRegister from "./componets/SellerRegister.js";
import SideBar from "./componets/SideBar.js";
import AddToCart from "./componets/AddToCart.js";
import OrderSummary from "./componets/OrderSummary";

function Layout({ children }) {
  const location = useLocation();

  const withCompactLayout = [
    "/shop",
    "/login",
    "/account",
    "/checkout",
    "/order-summary",
  ];

  const withSidebarHidden = [
    "/",
    "/login",
    "/account",
    "/shop",
    "/checkout",
    "/order-summary",
  ];

  const isShopPage = withCompactLayout.includes(location.pathname) || location.pathname.startsWith("/product");
  const isHomePage = withSidebarHidden.includes(location.pathname) || location.pathname.startsWith("/product");

  return (
    <div className="flex h-screen flex-col">
      <Header isShopPage={isShopPage} />
      <div className="flex flex-1 bg-[#faf7f3]">
        {!isHomePage && (
          <aside className="w-[270px] border-r bg-white dark:bg-gray-800">
            <SideBar />
          </aside>
        )}
        <main className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contactUs" element={<Contact />} />
          <Route path="/sellerRegister" element={<SellerRegister />} />
          <Route path="/card" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/checkout" element={<AddToCart />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="*" element={<PageNotFount />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
