import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmMassage from "../reusableComponent/ConfirmMassage";

export default function AddressPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        street: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [confirmedAddress, setConfirmedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDeliverHere = () => {
        if (selectedAddress) {
            setConfirmedAddress(selectedAddress);
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.token) return;

            const response = await axios.get(
                "http://localhost:5000/api/ecommerce/customer/address/list",
                { headers: { Authorization: user.token } }
            );

            const list = Array.isArray(response.data.addresses) ? response.data.addresses : [];
            setAddresses(list);

            // 👇 agar ek bhi address nahi hai to form show kare
            if (list.length === 0) {
                setShowForm(true);
            } else {
                setShowForm(false);
            }
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.token) {
                setError("You must be logged in to add an address.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/ecommerce/customer/address/add",
                formData,
                {
                    headers: { Authorization: user.token },
                }
            );

            console.log("Address Added:", response.data);
            setSuccess("Address added successfully!");
            fetchAddresses();

            // Safely update addresses
            setAddresses((prev) => {
                const prevArray = Array.isArray(prev) ? prev : [];
                return [...prevArray, response.data];
            });


            setAddresses((prev) => {
                const prevArray = Array.isArray(prev) ? prev : [];
                return [...prevArray, response.data];
            });
            // Reset form
            setFormData({
                name: "",
                phone: "",
                street: "",
                address: "",
                landmark: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            });

            setShowForm(false);
        } catch (err) {
            console.error("Error adding address:", err);
            setError("Failed to add address. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleRemove = async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.token) {
                alert("You must be logged in to remove an address.");
                return;
            }

            await axios.delete(
                `http://localhost:5000/api/ecommerce/customer/address/remove/${id}`,
                {
                    headers: { Authorization: user.token },
                }
            );

            // Remove the address from state
            setAddresses((prev) => prev.filter((addr) => addr._id !== id));
            setOpenDialog(false)
            // alert("Address removed successfully!");
        } catch (err) {
            console.error("Error removing address:", err);
            alert("Failed to remove address. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="max-w-7xl w-full grid grid-cols-[65%_35%] gap-6">
                {/* LEFT SIDE */}
                <div className="bg-white shadow-md rounded-2xl p-6">
                    {showForm ? (
                        <>
                            <h2 className="text-xl font-semibold mb-6 border-b pb-2">Add Address</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Full Name*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Mobile Number*"
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Street / House No*"
                                    required
                                />

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Full Address (locality, building, area)*"
                                    rows="2"
                                    required
                                />

                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Landmark (optional)"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="City*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="State*"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Postal Code*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Country*"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>

                                {success && <p className="text-green-600 mt-2">{success}</p>}
                                {error && <p className="text-red-600 mt-2">{error}</p>}
                            </form>
                        </>
                    ) : (


                        <div>
                            {!confirmedAddress ? (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2 border-b pb-3">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Select Delivery Address
                                        </h2>

                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="bg-pink-100 text-pink-600 font-semibold py-2 px-4 rounded-xl hover:bg-pink-200 transition"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>

                                    {/* Address List */}
                                    {addresses.map((addr) => {
                                        const isSelected = selectedAddress === addr._id;
                                        return (
                                            <div
                                                key={addr._id}
                                                className={`relative border border-gray-200 rounded-xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow bg-white ${isSelected ? "border-pink-400" : ""
                                                    }`}
                                            >
                                                {/* Top-right buttons */}
                                                <div className="absolute top-3 right-3 flex gap-1">
                                                    <button className="text-xs text-gray-500 hover:text-red-500 transition">
                                                        Remove
                                                    </button>
                                                    <button
                                                        onClick={() => setShowForm(true)}
                                                        className="text-xs text-gray-500 hover:text-blue-500 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>

                                                {/* Name and HOME badge */}
                                                <div className="flex items-center gap-2">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                setSelectedAddress(isSelected ? null : addr._id)
                                                            }
                                                        />
                                                        <div className="w-4 h-4 border border-gray-300 rounded-md peer-checked:bg-pink-500 peer-checked:border-pink-500 flex items-center justify-center transition-all duration-200">
                                                            <svg
                                                                className="hidden w-3 h-3 text-white peer-checked:block"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </label>
                                                    <h3 className="font-semibold text-gray-900 text-sm mb-0">
                                                        {addr.name}
                                                    </h3>
                                                    <span className="px-1 py-[1px] text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                                        HOME
                                                    </span>
                                                </div>

                                                {/* Address */}
                                                <p className="text-gray-600 mt-2 mb-0">
                                                    {addr.address}, {addr.street}, {addr.landmark}
                                                </p>
                                                <p className="text-gray-600 mt-1 mb-0">
                                                    {addr.city}, {addr.state} - {addr.postalCode}
                                                </p>
                                                <p className="text-gray-600 mt-1 mb-0">
                                                    Mobile:{" "}
                                                    <span className="font-medium text-gray-800">{addr.phone}</span>
                                                </p>

                                                {/* Expandable Deliver Button */}
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${isSelected ? "max-h-20 mt-4" : "max-h-0"
                                                        }`}
                                                >
                                                    <button
                                                        onClick={handleDeliverHere}
                                                        className="w-full text-center bg-pink-100 text-pink-600 font-semibold py-2 rounded-xl hover:bg-pink-200 transition"
                                                    >
                                                        Deliver Here
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {/* ✅ Selected Address Shown */}
                                    <div className="border border-pink-400 rounded-xl p-4 bg-white shadow-sm mb-4 relative">
                                        {/* Header with Change Address */}
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">Delivery Address</h3>
                                            <button
                                                onClick={() => setConfirmedAddress(null)}
                                                className="text-sm text-blue-600 hover:underline font-medium"
                                            >
                                                Change Address
                                            </button>
                                        </div>

                                        {addresses
                                            .filter((a) => a._id === confirmedAddress)
                                            .map((addr) => (
                                                <div key={addr._id}>
                                                    <p className="text-gray-700 font-medium">{addr.name}</p>
                                                    <p className="text-gray-600">
                                                        {addr.address}, {addr.street}, {addr.landmark}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {addr.city}, {addr.state} - {addr.postalCode}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Mobile: <span className="font-medium">{addr.phone}</span>
                                                    </p>
                                                </div>
                                            ))}
                                    </div>


                                    {/* ✅ Order Summary Section */}
                                    <div className="border rounded-2xl p-4 bg-white shadow-md">
                                        {/* Heading */}
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                        <hr className="my-4" />

                                        {/* Product Row */}
                                        <div className="flex items-start gap-4">
                                            {/* Image */}
                                            <img
                                                src="https://via.placeholder.com/100" // Replace with actual product image
                                                alt="Fastrack FS1 Pro Watch"
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />

                                            {/* Details */}
                                            <div className="flex-1 text-left">
                                                <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp">
                                                    Fastrack FS1 Pro / World's First, 1.96&quot; Super AMOLED [...]
                                                </p>
                                                <p className="text-gray-500 text-xs">Blue Strap, Free Size</p>

                                                {/* Price Row */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-600 font-semibold text-base">₹2,695</span>
                                                    <span className="line-through text-gray-400 text-xs">₹7,995</span>
                                                    <span className="text-green-600 text-xs font-medium">66% Off</span>
                                                </div>

                                                <p className="text-blue-600 text-xs">10 offers available</p>
                                            </div>
                                        </div>

                                        {/* Divider */}

                                        {/* Price Details */}


                                        {/* CTA Button */}
                                        <button className="mt-5 w-full bg-orange-600 text-white font-semibold py-2.5 rounded-xl hover:bg-orange-700 transition shadow-sm">
                                            CONTINUE
                                        </button>
                                    </div>


                                </>
                            )}
                        </div>


                    )}
                </div>

                {/* RIGHT SIDE - PRICE DETAILS */}
                <div className="bg-white shadow-md rounded-2xl p-6 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Price Details (1 Item)</h2>
                    <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                            <span>Total MRP</span>
                            <span>₹1,099</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount on MRP</span>
                            <span>-₹616</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform & Event Fee</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total Amount</span>
                            <span>₹483</span>
                        </div>
                    </div>

                    {!showForm && (
                        <button className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600">
                            CONTINUE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
