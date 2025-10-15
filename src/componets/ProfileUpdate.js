import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "../reusableComponent/NotificationProvider";


const ProfileUpdate = ({ avatar }) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        gender: "",
        email: "",
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (token) {
            try {
                const decoded = jwtDecode(token); // decode JWT
                // If gender is in decoded token use it, else fallback empty string
                const gender = decoded.gender || "";

                setFormData({
                    name: decoded.name || "",
                    phone: decoded.phone || "",
                    gender: gender,
                    email: decoded.email || "",
                });
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                gender: formData.gender,
            };

            const res = await axios.put(
                "http://localhost:5000/api/ecommerce/customer/update",
                payload,
                {
                    headers: { Authorization: token },
                }
            );

            showNotification("Profile update successfully", "success");
            console.log("Updated data:", res.data);

            const updatedUser = { ...user, ...payload };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            showNotification("Faild to update profile", "error");
            toast.error("Failed to update profile!");
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-amber-50 border border-amber-100">
                        {avatar ? (
                            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600 text-xl font-semibold">
                                {(formData.name?.[0] || "U").toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-left">
                        <h2 className="text-2xl font-semibold text-[#2F251F]">
                            Hey, {formData.name || "User"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
                    </div>
                </div>
            </div>

            {/* Profile Update Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6"
            >
                <h3 className="text-xl font-semibold text-[#2F251F] mb-4 text-left">
                    Update Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender} // <-- this will now reflect your token value
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                    </div>

                    {/* Email (non-editable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Email (Read only)
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full border border-gray-200 bg-gray-100 rounded-xl p-2.5 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all"
                    >
                        Update
                    </button>
                </div>
            </form>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default ProfileUpdate;
