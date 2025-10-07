import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { apiurl } from "../config/config";

export default function ProfilePopup() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const popupRef = useRef();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsOpen(false);
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Check if new password matches confirm password
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match!");
            return;
        }

        // Get token from localStorage
   
  const user = JSON.parse(localStorage.getItem("user"));
    console.log(user,"kjhdfsdbnkjaldm")

    if (!user?.token) {
      return alert("You must be logged in to update your password.");
    }
        try {
            setLoading(true);

            // Make API request with Authorization header
            const res = await axios.post(
                `${apiurl}/ecommerce/customer/update-password`,
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                },
                {
                    headers: {
                        Authorization: user.token, // send token here
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                setSuccess("Password updated successfully!");
                setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

                // Close modal after short delay
                setTimeout(() => {
                    setOpen(false);
                    setSuccess("");
                }, 1500);
            } else {
                setError(res.data.message || "Something went wrong!");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative" ref={popupRef}>
            <User
                className="text-white w-5 h-5 cursor-pointer hover:text-amber-800"
                onClick={() => setIsOpen(!isOpen)}
            />

            {/* Popup */}
            {isOpen && (
                <div className="absolute -right-9 top-12 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                    {user ? (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/account");
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Account
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/account");
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Order
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/account");
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Wishlist
                            </button>
                            <button
                                onClick={() => setOpen(true)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4 inline mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                navigate("/login");
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Login
                        </button>
                    )}

                    {/* Change Password Modal */}
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="bg-gradient-to-br from-white to-gray-100 w-[90%] max-w-md rounded-2xl shadow-2xl p-8 relative border border-amber-200"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
                                    >
                                        ✕
                                    </button>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                        🔐 Change Password
                                    </h2>

                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        {/* Old Password */}
                                        <div>
                                            <label className="block text-left text-gray-600 mb-1">
                                                Old Password
                                            </label>
                                            <div className="flex items-center border px-3 py-2 bg-white">
                                                <Lock className="text-[#37312F] w-5 h-5 mr-2" />
                                                <input
                                                    type="password"
                                                    name="oldPassword"
                                                    value={formData.oldPassword}
                                                    onChange={handleChange}
                                                    className="w-full focus:outline-none"
                                                    placeholder="Enter old password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-left text-gray-600 mb-1">
                                                New Password
                                            </label>
                                            <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                                                <Unlock className="text-[#37312F] w-5 h-5 mr-2" />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full focus:outline-none"
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-left text-gray-600 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                                                <Unlock className="text-[#37312F] w-5 h-5 mr-2" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full focus:outline-none"
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Error & Success */}
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        {success && <p className="text-green-600 text-sm">{success}</p>}

                                        {/* Save Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#37312F] text-white py-2 rounded-lg font-semibold shadow-md hover:bg-[#504f4f] transition relative overflow-hidden disabled:opacity-60"
                                        >
                                            {loading ? "Saving..." : "Save Changes"}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
