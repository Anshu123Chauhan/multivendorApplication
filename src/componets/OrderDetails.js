import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Loader2,
    MapPin,
    Package,
    CreditCard,
    CalendarDays,
    Truck,
    ShoppingBag,
    Hash,
} from "lucide-react";
import { apiurl } from "../config/config";
import InvoiceDownload from "../reusableComponent/InvoiceDownload";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const res = await axios.get(`${apiurl}/ecommerce/order/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setOrder(res.data.order);
            } catch (err) {
                console.error("Error fetching order details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
                <span className="ml-3 text-gray-600 font-medium">Loading order details...</span>
            </div>
        );

    if (!order)
        return (
            <div className="text-center text-gray-600 py-20">
                <p>Order not found.</p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-end mb-2">
                <InvoiceDownload order={order} />
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                        <h1 className="text-xl font-semibold text-[#2F251F] flex items-center gap-2">
                            <Package className="text-amber-500 w-5 h-5" />
                            Order Summary
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <CalendarDays className="w-4 h-4 text-amber-400" />
                            Ordered on{" "}
                            <span className="font-medium text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${order.status === "placed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {order.status?.toUpperCase()}
                    </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center text-sm text-gray-600 gap-x-4">
                    <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4 text-amber-400" />{" "}
                        <span className="font-medium">Order ID:</span>{" "}
                        {order.orderNumber}
                    </div>
                    <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-amber-400" />{" "}
                        <span className="font-medium">Payment:</span> {order.paymentMethod?.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-amber-400" />{" "}
                        <span className="font-medium">Shipping:</span>{" "}
                        {order.shippingMethod?.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 mb-4">
                <h2 className="text-base font-semibold text-[#2F251F] mb-3 flex items-center gap-2">
                    <ShoppingBag className="text-amber-500 w-4 h-4" /> Items
                </h2>

                {order.items?.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center border-b border-gray-100 py-3 last:border-none"
                    >
                        <img
                            src={item.productId?.images?.[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="ml-4 flex-1">
                            <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {item.productId?.description}
                            </p>
                            <div className="flex justify-between text-sm text-gray-700 mt-1">
                                <span>Qty: {item.qty}</span>
                                <span className="font-medium">₹{item.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shipping + Summary Section */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
                    <h2 className="text-base font-semibold text-[#2F251F] mb-3 flex items-center gap-2">
                        <MapPin className="text-amber-500 w-4 h-4" /> Shipping Address
                    </h2>
                    <div className="text-sm text-gray-700 space-y-0.5">
                        <p className="font-medium">{order.shippingAddress?.recipientName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                        </p>
                        <p>{order.shippingAddress?.country}</p>
                        <p className="text-gray-500 mt-1">
                            Phone: {order.shippingAddress?.phone}
                        </p>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
                    <h2 className="text-base font-semibold text-[#2F251F] mb-3 flex items-center gap-2">
                        <CreditCard className="text-amber-500 w-4 h-4" /> Payment Summary
                    </h2>

                    <div className="text-sm text-gray-700 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium">₹{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium capitalize">{order.shippingMethod}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 pt-2 mt-2 text-base font-semibold">
                            <span>Total</span>
                            <span className="text-amber-600">₹{order.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 bg-amber-50 border border-amber-100 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Truck className="text-amber-500 w-5 h-5" />
                    <span className="text-gray-700 text-sm md:text-base">
                        Your order is currently <b>{order.status}</b>.
                    </span>
                </div>
                <button className="text-xs md:text-sm bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition">
                    Track Order
                </button>
            </div>
        </div>
    );
}
