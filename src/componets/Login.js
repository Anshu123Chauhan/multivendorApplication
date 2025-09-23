import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import glogo from '../../src/images/glogo.jpg'
import handring from '../../src/images/handring.jpg'
import axios from "axios";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const navigate = useNavigate();
  
const api = axios.create({
  baseURL: "https://graduated-foods-officers-varieties.trycloudflare.com/api/ecommerce",
});

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await api.post("/customer/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log("Login Response:", response.data);

        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");  
        }
      } else {
        const response = await api.post("/customer/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        console.log("Register Response:", response.data);

        alert("Registration successful!");
        setIsLogin(true);
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        alert(error.response.data.message || "Request failed!");
      } else {
        console.error("Network Error:", error.message);
        alert("Network Error! Backend se connect nahi ho paaya.");
      }
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-sm">
          {/* Logo */}
          {/* <h1 className="text-xl font-bold mb-8">cherryloves</h1> */}

          {/* Title */}
          <h2 className="text-3xl font-semibold mb-4">
            {isLogin ? "Login to your account" : "Create your account"}
          </h2>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                    required
                  />
                </>
              )}

              <input
                type="text"
                name="email"
                placeholder="Email or Phone Number"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded w-3 h-3" />Remember me
                </label>
                {isLogin && (
                  <button type="button" className="text-gray-600 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#423C39] text-white rounded-lg hover:bg-amber-800 transition"
              >
                {isLogin ? "Login in" : "Sign up"}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <img
                src={glogo}
                alt="Google"
                className="w-6 h-6"
              />
              Sign in with Google
            </button>
          
          </div>

          {/* Toggle */}
          <p className="mt-6 text-sm text-[#423C39] text-center">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold underline hover:text-amber-800"
            >
              {isLogin ? "Sign up now" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Image Grid Section */}
     <div className="hidden md:grid md:w-1/2 grid-cols-2 gap-2 p-2">
  {/* Left Column */}
  <div className="flex flex-col gap-2">
    <img
      src="https://images.unsplash.com/photo-1590166223826-12dee1677420?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt=""
      className="object-cover w-full h-64 rounded-lg"
    />
    <img
      src="https://plus.unsplash.com/premium_photo-1674255466836-f38d1cc6fd0d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt=""
      className="object-cover w-full h-96 rounded-lg"
    />
  </div>

  {/* Right Column */}
  <div className="flex flex-col gap-2">
    <img
      src="https://images.unsplash.com/photo-1701450706884-9cd56416ac6c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt=""
      className="object-cover w-full h-96 rounded-lg"
    />
    <img
    src={handring}
    alt=""
      className="object-cover w-full h-64 rounded-lg"
    />
  </div>
</div>

    </div>
  );
}


























































// import React, { useEffect,useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useSelector, useDispatch } from "react-redux";
// import "./css_files/showProduct.css";
// import AnimatePage from "../animation/AnimatePage";
// import {
//   onChangeUser,
//   selectUserEmail,
//   selectUserName,
//   selectUserPic,
//   setActiveState,
// } from "../feautres/userSlice";
// import { auth, fProvider, provider } from "../firebase/firebaseConfig";
// import { signInWithPopup } from "firebase/auth";

// const Login = () => {
//   const { t, i18n } = useTranslation();
//   const dispatch = useDispatch();
//   const userName = useSelector(selectUserName);
//   const userEmail = useSelector(selectUserEmail);
//   const pic = useSelector(selectUserPic);

//   /* Function SignIn with Google Account */

//   const handelSignInGoogle = () => {
//     signInWithPopup(auth, provider).then((data) => {
//       dispatch(
//         setActiveState({
//           userName: data.user.displayName.split(" ")[0],
//           userEmail: data.user.email,
//           pic: data.user.photoURL,
//         })
//       );
//     });
//   };
 
//  /* Function SignIn with Facebook Account */
//   const handelSignInWithFacebook = () => {
//     signInWithPopup(auth, fProvider).then((data) => {
//       dispatch(
//         setActiveState({
//           userName: data.user.displayName.split(" ")[1],
//           userEmail: data.user.email,
//           pic: data.user.photoURL,
//         })
//       );
//     });
//   };

  

//   return (
//     <section className=" bg-gray-100 bg-gradient-to-br font-['Cairo']">
//       <AnimatePage>
//         <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//           <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
//                 {t("signIn")}
//               </h1>
//               <div className="grid space-y-4 p-4">
//                 <button className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
//                   <div
//                     onClick={handelSignInGoogle}
//                     className="relative flex items-center space-x-4 justify-center"
//                   >
//                     <img
//                       src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
//                       className="absolute left-0 w-5"
//                       alt="google_logo"
//                     />

//                     <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
//                       {t("withGoogle")}
//                     </span>
//                   </div>
//                 </button>

//                 {/* <button
//                   onClick={handelSignInWithFacebook}
//                   className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
//                 >
//                   <div className="relative flex items-center space-x-4 justify-center">
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
//                       className="absolute left-0 w-5"
//                       alt="Facebook logo"
//                     />
//                     <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
//                       {t("withFacebook")}
//                     </span>
//                   </div>
//                 </button> */}

//               </div>
//               <hr className="border-t mx-2 border-grey-light" />
//               <p className="text-[17px] font-semibold text-gray-800">
//                 {t("login")}
//               </p>
//               <form className="space-y-4 md:space-y-6" action="#">
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     {t("yourEmail")}
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     id="email"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     placeholder="name@company.com"
//                     required=""
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     {t("password")}
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     id="password"
//                     placeholder="••••••••"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     required=""
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-start">
//                     <div className="flex items-center h-5">
//                       <input
//                         id="remember"
//                         type="checkbox"
//                         className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
//                         required=""
//                       />
//                     </div>
//                     <div className="ml-3 text-sm">
//                       <label
//                         htmlFor="remember"
//                         className="text-gray-500 dark:text-gray-300"
//                       >
//                         {t("remember")}
//                       </label>
//                     </div>
//                   </div>
//                   <a
//                     href="/"
//                     className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
//                   >
//                     {t("forget")}
//                   </a>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full text-white bg-gradient-to-r from-blue-400 to-sky-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
//                 >
//                   {t("login")}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </AnimatePage>
//     </section>
//   );
// };

// export default Login;
