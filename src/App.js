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

function Layout({ children }) {
  const location = useLocation();

  // agar shop page hai to ek flag set kare
  // const isShopPage = location.pathname === "/shop";
  // const isHomePage = location.pathname === "/";

  const isShopPage = ["/shop", "/login", "/account", "/checkout"].includes(location.pathname) || location.pathname.startsWith("/product");
  const isHomePage = ["/", "/login", "/account", "/shop", "/checkout"].includes(location.pathname) || location.pathname.startsWith("/product")

  return (
    <div className="flex flex-col h-screen">
      <Header isShopPage={isShopPage} />
      <div className="flex flex-1">
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
          <Route path="*" element={<PageNotFount />} />
        </Routes>
      </Layout>

    </Router>
  );
}

export default App;






























// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import React from "react";
// import Header from "./componets/Header";
// import Contact from "./componets/Contact";
// import Cart from "./componets/Cart";
// import PageNotFount from "./componets/PageNotFound";
// import Footer from "./componets/Footer";
// import Home from "./componets/Home";
// import Shop from "./componets/Shop";
// import Login from "./componets/Login";
// import Account from "./componets/Account";
// import { ProductDetails } from "./componets/ProductDetails";
// import Confirmation from './componets/Confirmation.jsx';
// import SellerRegister from "./componets/SellerRegister.js";

// // ---- Wrapper for layout ----
// function Layout({ children }) {
//   const location = useLocation();

//   // routes jahan header/footer nahi chahiye
//   const hideHeaderFooterRoutes = ["/login", "/account", "/sellerRegister","/shop"];

//   const shouldHide = hideHeaderFooterRoutes.includes(location.pathname);

//   return (
//     <>
//       {!shouldHide && <Header />}
//       {children}
//       {!shouldHide && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/shop" element={<Shop />} />
//           <Route path="/contactUs" element={<Contact />} />
//           <Route path="/sellerRegister" element={<SellerRegister />} />
//           <Route path="/card" element={<Cart />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/account" element={<Account />} />
//           <Route path="/productDetails" element={<ProductDetails />} />
//           <Route path="/confirmation" element={<Confirmation />} />
//           <Route path="*" element={<PageNotFount />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;
