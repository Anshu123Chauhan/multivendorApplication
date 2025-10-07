import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import glogo from '../../src/images/glogo.jpg'
import handring from '../../src/images/handring.jpg'
import axios from "axios";
import { useNavigate } from "react-router-dom"; // use react-router-dom
import { apiurl } from "../config/config";
export default function AuthPage() {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: `${apiurl}/ecommerce`,
  });

  const [isLogin, setIsLogin] = useState(true);
  const [isLoginEmailInput, setIsLoginEmailInput] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
  const [otpId, setOtpId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---- LOGIN & REGISTER ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!/^[A-Za-z ]+$/.test(formData.name)) {
    //   alert("Name must contain only alphabets.");
    //   return;
    // }

    // Phone validation
    // if (!/^\d{10}$/.test(formData.phone)) {
    //   alert("Phone number must be exactly 10 digits.");
    //   return;
    // }

    // Email validation
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   alert("Please enter a valid email address.");
    //   return;
    // }

    // Password validation
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      alert("Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.");
      return;
    }

    try {
      if (isLogin) {
        const response = await api.post("/customer/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Login Response:", response.data);
        if (response.data) {
          // localStorage.setItem("user", JSON.stringify(response.data.token));
          localStorage.setItem("user", JSON.stringify({ token: response.data.token }));
          // notify other parts of app (Profile popup)
          window.dispatchEvent(new Event("userLoggedIn"));
          window.dispatchEvent(new Event("storage"));
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
        setIsLoginEmailInput(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Request failed!");
    }
  };

  // ---- FORGOT PASSWORD FLOW ----
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter an email first.");
      return;
    }
    try {
      // endpoint relative to baseURL
      const res = await api.post("/customer/send-otp", { email: formData.email });
      console.log("send-otp response:", res.data);
      // try multiple possible shapes
      const returnedOtpId =
        res.data?.otpId || res.data?.data?.otpId || res.data?.data;
      if (returnedOtpId) {
        setOtpId(returnedOtpId);
      } else if (res.data?.message?.toLowerCase()?.includes("sent")) {
        // sometimes backend doesn't return otpId immediately
        // still proceed to otp step and assume verify call will return success
      }
      setStep("otp");
      alert("OTP sent (check email).");
    } catch (err) {
      console.error("Send OTP error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }
    try {
      const res = await api.post("/customer/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      console.log("verify-otp response:", res.data);
      const ok = res.data?.success || res.data?.verified || res.status === 200;
      if (ok) {
        // if backend returns new otpId on verify, capture it
        const returnedOtpId = res.data?.otpId || res.data?.data?.otpId;
        if (returnedOtpId) setOtpId(returnedOtpId);
        setStep("reset");
        alert("OTP verified. Enter new password.");
      } else {
        alert(res.data?.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("Verify OTP error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    if (!formData.password) {
      alert("Please enter your new password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/customer/forget-password", {
        email: formData.email,
        password: formData.password,
        otpId: otpId,
      });

      console.log("forget-password response:", res.data);

      const ok = res.data?.success || res.status === 200;
      if (ok) {
        alert("Password reset successfully! Please login.");
        // reset forgot flow
        setIsForgotPassword(false);
        setStep("email");
        setOtpId(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "", // confirm reset bhi clear kar do
          otp: "",
        });
      } else {
        alert(res.data?.message || "Password reset failed");
      }
    } catch (err) {
      console.error("Reset password error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Password reset failed");
    }
  };


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) navigate("/");
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold mb-4">
            {isForgotPassword
              ? step === "email"
                ? "Forgot Password"
                : step === "otp"
                  ? "Verify OTP"
                  : "Reset Password"
              : isLogin
                ? "Login to your account"
                : "Create your account"}
          </h2>

          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              // ---- LOGIN & SIGNUP FORM ----
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
                    {/* Name - only alphabets */}
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-z ]/g, ""); // sirf letters aur space allow
                        setFormData({ ...formData, name: value });
                      }} className="w-full px-4 py-2 border rounded-lg"
                      pattern="^[A-Za-z ]+$"   // sirf alphabets aur space allow
                      title="Name must contain only letters"
                      required
                    />

                    {/* Phone - only 10 digits */}
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        // Sirf number allow kare aur max 10 digit
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setFormData({ ...formData, phone: value });
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </>
                )}

               {!isLoginEmailInput && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email or Phone Number"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
               )}

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
                  required
                />


                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded w-3 h-3" />
                    Remember me
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-gray-600 hover:underline"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setStep("email");
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#37312F] text-white rounded-lg hover:bg-amber-800 transition"
                >
                  {isLogin ? "Login in" : "Sign up"}
                </button>
              </motion.form>
            ) : (
              // ---- FORGOT PASSWORD FORM ----
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Step: email */}
                {step === "email" && (
                  <>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full py-2 bg-[#37312F] text-white rounded-lg hover:bg-amber-800"
                    >
                      Send OTP
                    </button>
                  </>
                )}

                {/* Step: otp */}
                {step === "otp" && (
                  <>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full py-2 bg-[#37312F] text-white rounded-lg hover:bg-amber-800"
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                {/* Step: reset */}
                {step === "reset" && (
                  <>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter New Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="w-full py-2 bg-[#37312F] text-white rounded-lg hover:bg-amber-800"
                    >
                      Reset Password
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setStep("email");
                    setOtpId(null);
                    setFormData({ name: "", email: "", phone: "", password: "", otp: "" });
                  }}
                  className="text-gray-600 hover:underline block mx-auto"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider & Social */}
          {!isForgotPassword && (
            <>
              <div className="flex items-center gap-4 my-6">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500 text-sm">or</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                  <img src={glogo} alt="Google" className="w-6 h-6" />
                  Sign in with Google
                </button>
              </div>

              <p className="mt-6 text-sm text-[#37312F] text-center">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => (setIsLogin(!isLogin), setIsLoginEmailInput(!isLoginEmailInput))}
                  className="font-semibold underline hover:text-amber-800">
                  {isLogin ? "Sign up now" : "Login"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:grid md:w-1/2 grid-cols-2 gap-2 p-2">
        <div className="flex flex-col gap-2">
          <img
            src="https://images.unsplash.com/photo-1590166223826-12dee1677420?q=80&w=689&auto=format&fit=crop"
            alt=""
            className="object-cover w-full h-64 rounded-lg"
          />
          <img
            src="https://plus.unsplash.com/premium_photo-1674255466836-f38d1cc6fd0d?q=80&w=687&auto=format&fit=crop"
            alt=""
            className="object-cover w-full h-96 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <img
            src="https://images.unsplash.com/photo-1701450706884-9cd56416ac6c?q=80&w=1974&auto=format&fit=crop"
            alt=""
            className="object-cover w-full h-96 rounded-lg"
          />
          <img src={handring} alt="" className="object-cover w-full h-64 rounded-lg" />
        </div>
      </div>
    </div >
  );
}