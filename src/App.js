import { CartWishlistProvider } from "./context/CartWishlistContext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Header from "./componets/Header";
import Contact from "./componets/Contact";
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
import { NotificationProvider } from "./reusableComponent/NotificationProvider.js";
import WishList from "./componets/WishList.js";
import AddressPage from "./componets/AddressPage.js";
import OrderSummary from "./componets/OrderSummary";
import SearchResults from "./componets/SearchReasult.js";
import OrdersList from "./componets/OrdersList.js";
// import PaymentPage from "./componets/PaymentPage.js";
// import OrderDetails from "./componets/OrderDetails.js";

function Layout({ children }) {
  const location = useLocation();

  // agar shop page hai to ek flag set kare
  // const isShopPage = location.pathname === "/shop";
  // const isHomePage = location.pathname === "/";

  const isShopPage = ["/shop", "/login", "/account", "/cart", "/wishlist", "/checkout", "/payment", "/order-summary", "/search"].includes(location.pathname) || location.pathname.startsWith("/product");
  const isHomePage = ["/", "/login", "/account", "/shop", "/cart", "/wishlist", "/checkout", "/payment", "/order-summary", "/search"].includes(location.pathname) || location.pathname.startsWith("/product")

  return (
    <div className="flex flex-col h-screen">
      <Header isShopPage={isShopPage} />
      <div className="flex flex-1 bg-[#faf7f3]">
        {!isHomePage && (
          <aside className="w-[270px] bg-white dark:bg-gray-800 border-r">
            <SideBar />
          </aside>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <CartWishlistProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contactUs" element={<Contact />} />
              <Route path="/sellerRegister" element={<SellerRegister />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/cart" element={<AddToCart />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/checkout" element={<AddressPage />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/order-list" element={<OrdersList />} />
              <Route path="/search" element={<SearchResults />} />
              {/* <Route path="/payment" element={<PaymentPage />} /> */}
              <Route path="*" element={<PageNotFount />} />
            </Routes>
          </Layout>
        </Router>
      </CartWishlistProvider>
    </NotificationProvider>
  );
}
export default App;




























