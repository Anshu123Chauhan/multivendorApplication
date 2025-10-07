import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CreditCard, Smartphone, Banknote, Wallet, XCircle, CheckCircle } from "lucide-react";
import ConfirmMassage from "../reusableComponent/ConfirmMassage";
import { useNavigate } from "react-router";
import {apiurl} from "../config/config"

export default function AddressPage() {



    const navigate = useNavigate();
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
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [confirmedAddress, setConfirmedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [cartId, setCartId] = useState("");
    const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
    let email = "";
    if (user) {
        const decoded = jwtDecode(user.token); // decode JWT payload
        email = decoded.email;
        console.log(email, "hellooooo")
    }


    const [selectedPayment, setSelectedPayment] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [message, setMessage] = useState(""); // for custom messages

    const paymentMethods = [
        { id: "cod", label: "Cash on Delivery (COD)", icon: <Banknote size={20} /> },
        { id: "upi", label: "UPI", icon: <Smartphone size={20} /> },
        { id: "netbanking", label: "Net Banking", icon: <Banknote size={20} /> },
        { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} /> },
        { id: "wallet", label: "Wallets", icon: <Wallet size={20} /> },
    ];

    const handlePayment = () => {
        if (selectedPayment === "cod") {
            setMessage("Thank You! Your order has been placed successfully. You can pay at delivery.");
        } else {
            setMessage("Sorry! This payment method is currently not available.");
        }
        setOrderPlaced(true);
    };


    const [products, setProducts] = useState([]);
    //   const user = JSON.parse(localStorage.getItem("user"));

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
                `${apiurl}/ecommerce/customer/address/list`,
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

    useEffect(() => {
        const fetchCart = async () => {
            if (!user?.token) return alert("Please login to view cart!");

            try {
                const response = await axios.get(
                    `${apiurl}/ecommerce/cart/list`,
                    { headers: { Authorization: user.token } }
                );

                const cartData = response.data?.cart || {};
                const itemsArray = cartData.items || [];

                setProducts(itemsArray);
                setTotalPrice(cartData.totalPrice || 0);
                setCartId(cartData._id); // ✅ store cart ID for later use
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                alert("Failed to fetch cart data.");
            }
        };

        fetchCart();
    }, [user]);

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
                `${apiurl}/ecommerce/customer/address/add`,
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
                `${apiurl}/ecommerce/customer/address/remove/${id}`,
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

    const handlePlaceOrder = async () => {
        if (!products.length) {
            alert("No items in the cart.");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.token) {
                alert("Please login to place an order.");
                return;
            }

            // ✅ Get address from state (first address le rahe hain for demo)
            const selectedAddress = addresses.length > 0 ? addresses[0] : null;
            if (!selectedAddress) {
                alert("Please add a delivery address.");
                return;
            }

            const payload = {
                orderNumber: cartId,
                items: products.map((item) => ({
                    sellerId: item.parent_id,     // seller id
                    productId: item.productId,    // product id
                    name: item.name,              // ✅ product name
                    qty: String(item.quantity),   // ✅ quantity as string
                    price: String(item.price),    // ✅ price as string
                })),
                shippingAddress: {
                    label: "self",
                    recipientName: selectedAddress.name,
                    email: email || "",
                    phone: selectedAddress.phone,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    country: selectedAddress.country,
                    pincode: selectedAddress.postalCode,
                },
                paymentMethod: "cod",
                subtotal: String(totalPrice),
                shippingMethod: "standard",
                shippingCost: "0",
                total: String(totalPrice),
            };

            const response = await axios.post(
                `${apiurl}/ecommerce/order/place`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setShowOrderSuccess(true);
            console.log("Order Response:", response.data);
        } catch (error) {
            console.error("Failed to place order:", error.response?.data || error.message);
            alert("Failed to place order. Please try again.");
        }
    };





    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="max-w-7xl w-full grid grid-cols-[65%_35%] gap-6">
                {/* LEFT SIDE */}
                <div className="bg-white p-6 max-h-[600px] overflow-y-auto">
                    {showForm ? (
                        <>
                            <h2 className="text-xl font-semibold mb-6 border-b pb-2 font-nunito">
                                Add Address
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4 font-nunito">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                        placeholder="Full Name*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                        placeholder="Mobile Number*"
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                    placeholder="Street / House No*"
                                    required
                                />

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                    placeholder="Full Address (locality, building, area)*"
                                    rows="2"
                                    required
                                />

                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                    placeholder="Landmark (optional)"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                        placeholder="City*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
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
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                        placeholder="Postal Code*"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full border p-3 text-sm focus:ring-2 focus:ring-[#37312F] outline-none"
                                        placeholder="Country*"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2 border text-[#37312F] font-medium hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-[#37312F] text-white font-medium hover:opacity-90 transition disabled:opacity-50"
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
                                    <div className="flex items-center justify-between mb-2 border-b pb-2 font-nunito">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Select Delivery Address
                                        </h2>

                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="bg-[#37312F] text-white font-semibold py-1 px-3 hover:opacity-90 transition"
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
                                                className={`relative border border-gray-300 p-3 mb-1 bg-white font-nunito ${isSelected ? "border-[#37312F]" : ""
                                                    }`}
                                            >
                                                {/* Top-right buttons */}
                                                <div className="absolute top-2 right-2 flex gap-1 text-xs">
                                                    <button
                                                        onClick={() => handleRemove(addr._id)}
                                                        className="text-gray-600 hover:text-red-600 transition"
                                                    >
                                                        Remove
                                                    </button>
                                                    <button
                                                        onClick={() => setShowForm(true)}
                                                        className="text-gray-600 hover:text-blue-600 transition"
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
                                                        <div className="w-4 h-4 border border-gray-400 flex items-center justify-center transition-all duration-200 peer-checked:bg-[#37312F] peer-checked:border-[#37312F]">
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
                                                    <span className="px-1 py-[1px] text-xs bg-green-100 text-green-700 font-medium">
                                                        HOME
                                                    </span>
                                                </div>

                                                {/* Address */}
                                                <p className="text-gray-700 mt-1 mb-0 text-sm">
                                                    {addr.address}, {addr.street}, {addr.landmark}
                                                </p>
                                                <p className="text-gray-700 mt-1 mb-0 text-sm">
                                                    {addr.city}, {addr.state} - {addr.postalCode}
                                                </p>
                                                <p className="text-gray-700 mt-1 mb-0 text-sm">
                                                    Mobile: <span className="font-medium text-gray-800">{addr.phone}</span>
                                                </p>

                                                {/* Expandable Deliver Button */}
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${isSelected ? "max-h-16 mt-2" : "max-h-0"
                                                        }`}
                                                >
                                                    <button
                                                        onClick={handleDeliverHere}
                                                        className="w-full text-center bg-[#37312F] text-white font-semibold py-1 hover:opacity-90 transition"
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
                                    <div className="border border-[#37312F] p-3 bg-white mb-3 font-nunito relative">
                                        {/* Header with Change Address */}
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 text-sm">Delivery Address</h3>
                                            <button
                                                onClick={() => setConfirmedAddress(null)}
                                                className="text-sm text-[#37312F] hover:underline font-medium"
                                            >
                                                Change Address
                                            </button>
                                        </div>

                                        {addresses
                                            .filter((a) => a._id === confirmedAddress)
                                            .map((addr) => (
                                                <div key={addr._id}>
                                                    <p className="text-gray-800 font-medium text-sm">{addr.name}</p>
                                                    <p className="text-gray-700 text-xs">
                                                        {addr.address}, {addr.street}, {addr.landmark}
                                                    </p>
                                                    <p className="text-gray-700 text-xs">
                                                        {addr.city}, {addr.state} - {addr.postalCode}
                                                    </p>
                                                    <p className="text-gray-700 text-xs">
                                                        Mobile: <span className="font-medium">{addr.phone}</span>
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                    {/* ✅ Order Summary Section */}
                                    <div className="border p-3 bg-white font-nunito">
                                        {/* Heading */}
                                        <h3 className="text-sm font-bold text-gray-800 mb-2">Order Summary</h3>

                                        {products.length > 0 ? (
                                            <>
                                                {products.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 mb-2 border-b pb-2 last:border-none"
                                                    >
                                                        {/* ✅ Product Image */}
                                                        <img
                                                            src={
                                                                item.variant?.selectedVariant?.images?.[0] || item.image || "https://via.placeholder.com/100"
                                                            }
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded" />

                                                        {/* ✅ Product Details */}
                                                        <div className="flex-1 text-left">
                                                            <p className="font-semibold text-gray-800 text-sm leading-snug">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                                                {item.description}
                                                            </p>

                                                            {/* Attributes */}
                                                            {item.variant?.selectedVariant?.attributes?.length > 0 && (
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    {item.variant.selectedVariant.attributes
                                                                        .map((attr) => `${attr.type}: ${attr.value}`)
                                                                        .join(", ")}
                                                                </p>
                                                            )}

                                                            {/* ✅ Price + Qty */}
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <span className="text-red-600 font-semibold text-sm">
                                                                    ₹{item.price}
                                                                </span>
                                                                {item.variant?.selectedVariant?.mrp && (
                                                                    <span className="line-through text-gray-400 text-xs">
                                                                        ₹{item.variant.selectedVariant.mrp}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-gray-600 ml-1">
                                                                    Qty: {item.quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <p className="text-gray-500 text-xs">No items in cart</p>
                                        )}
                                    </div>

                                    {/* ---------------- PAYMENT ---------------- */}
                                    <div className="mt-6 max-w-5xl mx-auto p-6 bg-white border">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                                            Select Payment Method
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Payment Options */}
                                            <div className="flex flex-col gap-3">
                                                {paymentMethods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => setSelectedPayment(method.id)}
                                                        className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition 
            ${selectedPayment === method.id
                                                                ? "border-orange-500 bg-orange-50 shadow-sm"
                                                                : "border-gray-300 hover:border-orange-400"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {method.icon}
                                                            <span className="font-medium">{method.label}</span>
                                                        </div>
                                                        {selectedPayment === method.id && (
                                                            <span className="text-orange-600 font-bold">✓</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Selected Payment Details */}
                                            <div className="border rounded-xl p-6 min-h-[300px] flex flex-col justify-center">
                                                {!selectedPayment ? (
                                                    <p className="text-gray-500 text-center my-auto">
                                                        Please select a payment method
                                                    </p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {selectedPayment === "upi" && (
                                                            <div className="space-y-2">
                                                                <label className="text-gray-700 font-medium">Enter UPI ID</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="example@upi"
                                                                    className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                />
                                                            </div>
                                                        )}

                                                        {selectedPayment === "netbanking" && (
                                                            <div className="space-y-2">
                                                                <label className="text-gray-700 font-medium">Select Bank</label>
                                                                <select className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                                    <option>HDFC Bank</option>
                                                                    <option>ICICI Bank</option>
                                                                    <option>SBI</option>
                                                                    <option>Axis Bank</option>
                                                                    <option>Other Banks</option>
                                                                </select>
                                                            </div>
                                                        )}

                                                        {selectedPayment === "card" && (
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Card Number"
                                                                    className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                />
                                                                <div className="flex gap-3">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="MM/YY"
                                                                        className="border border-gray-300 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                    />
                                                                    <input
                                                                        type="password"
                                                                        placeholder="CVV"
                                                                        maxLength="3"
                                                                        className="border border-gray-300 rounded-xl p-3 w-28 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                    />
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Cardholder Name"
                                                                    className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                />
                                                            </div>
                                                        )}

                                                        {selectedPayment === "wallet" && (
                                                            <div>
                                                                <p className="font-medium mb-2">Select Wallet</p>
                                                                <div className="flex gap-3 flex-wrap">
                                                                    {["PhonePe", "Paytm", "Google Pay", "Mobikwik"].map((wallet) => (
                                                                        <button
                                                                            key={wallet}
                                                                            className="px-4 py-2 border rounded-xl hover:bg-orange-50 transition"
                                                                        >
                                                                            {wallet}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {selectedPayment === "cod" && (
                                                            <p className="text-gray-700 font-medium text-center">
                                                                Cash on Delivery is selected by default. You can pay when your order arrives.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>

                            )}
                        </div>


                    )}
                </div>

                {/* RIGHT SIDE - PRICE DETAILS */}
                <div className="border p-3 bg-white font-nunito h-fit">
                    <h2 className="text-sm font-semibold mb-2 text-gray-800">
                        Price Details (1 Item)
                    </h2>

                    <div className="space-y-1 text-gray-700 text-xs">
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
                        <hr className="my-1 border-gray-300" />
                        <div className="flex justify-between font-semibold text-sm text-gray-900">
                            <span>Total Amount</span>
                            <span>₹483</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        className="mt-3 w-full bg-[#37312F] text-white py-1 hover:opacity-90 transition font-medium text-sm"
                    >
                        Place Order
                    </button>


                </div>

            </div>


            {showOrderSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-8 h-screen w-full text-center relative flex items-center justify-center">
                        <div>
                            {/* Success Icon */}
                            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />

                            {/* Heading */}
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Order Placed Successfully!
                            </h1>

                            {/* Message */}
                            <p className="text-gray-600 mb-6">
                                Thank you for your purchase. Your order has been placed and is being processed.
                            </p>

                            {/* Go to Home Button */}
                            <button
                                onClick={() => navigate("/")}
                                className="w-72 bg-[#37312F] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
