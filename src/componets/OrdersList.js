import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowUpDown,
  Download,
  Eye,
  Search as SearchIcon,
  Heart,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiurl } from "../config/config";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const ORDERS_PER_PAGE = 10;

const getStatusStyle = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("delivered") || normalized.includes("completed")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (normalized.includes("shipped") || normalized.includes("processing")) {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }
  if (normalized.includes("cancel")) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }
  return "bg-amber-100 text-amber-700 border-amber-200";
};

const extractOrderTotal = (order) => {
  const candidates = [order?.total];

  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  if (Array.isArray(order?.items)) {
    return order.items.reduce((sum, item) => {
      const price = Number(item?.price || item?.total || 0);
      const qty = Number(item?.quantity || 1);
      return sum + price * qty;
    }, 0);
  }

  return 0;
};

const formatCurrency = (value = 0) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  return value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  try {
    return new Date(value).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "-";
  }
};

// Define all possible tracking steps, including return and refund
const trackingSteps = [
  { key: "placed", label: "Order Placed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
  // { key: "return_requested", label: "Return Requested" },
  // { key: "refunded", label: "Refunded" },
];

// Function to generate tracking details
const getTrackingDetails = (order) => {
  const orderTracking = order?.orderTracking || {};

  return trackingSteps.map((step) => ({
    ...step,
    completed: !!orderTracking[step.key], // True if date exists
    date: orderTracking[step.key] || null,
  }));
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to track selected order for popup
  const navigate = useNavigate();

  const openPopup = (order) => {
    setSelectedOrder(order); // Set the selected order
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedOrder(null); // Clear selected order
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.token) {
        setOrders([]);
        setTotalPages(1);
        return;
      }

      const response = await axios.get(`${apiurl}/ecommerce/order/list`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          page: currentPage,
          limit: ORDERS_PER_PAGE,
          search: search || "",
          sortBy,
          order,
        },
      });

      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, order, search, sortBy]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const summary = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return { count: 0, totalValue: 0 };
    }

    const totalValue = orders.reduce((sum, order) => sum + extractOrderTotal(order), 0);
    return {
      count: orders.length,
      totalValue,
    };
  }, [orders]);

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 h-4 w-1/3 rounded bg-gray-200" />
          <div className="mb-2 h-3 w-2/3 rounded bg-gray-100" />
          <div className="mb-6 h-3 w-1/2 rounded bg-gray-100" />
          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded bg-gray-100" />
            <div className="h-10 flex-1 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f3] py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              Order history
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#2F251F]">Your orders</h1>
            <p className="text-sm text-gray-500">
              Track, download invoices, and revisit your past purchases in one place.
            </p>
          </div>

          <div className="flex gap-3 text-sm text-[#2F251F]">
            <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Orders</p>
              <p className="mt-1 text-lg font-semibold">{summary.count}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Value</p>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(summary.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search by order number, name, or status"
              className="h-12 w-full rounded-full border border-amber-100 bg-white pl-12 pr-4 text-sm font-medium text-[#2F251F] shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <ArrowUpDown className="h-4 w-4" />
              sort
            </div>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 rounded-full border border-amber-100 bg-white px-4 text-sm font-medium text-[#2F251F] focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <option value="createdAt">Created date</option>
                <option value="orderNumber">Order number</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="h-11 rounded-full border border-amber-100 bg-white px-4 text-sm font-medium text-[#2F251F] focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          renderSkeleton()
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-200 bg-white/60 p-12 text-center shadow-sm">
            <Heart className="mx-auto h-10 w-10 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold text-[#2F251F]">
              No orders found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Start shopping to see your orders appear here. Use the search if you are looking for something specific.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const item = order.items[0];
              const product = item?.productId;

              return (
                <div
                  key={order._id}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow-md hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  {/* Product Image */}
                  <div className="w-[100px] h-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border">
                    <img
                      src={product?.images?.[0]}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-1 justify-between items-center">
                    {/* Product Info */}
                    <div className="flex flex-col justify-between h-full">
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-1 text-left mb-0">
                        {product?.name || "Product Name"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {product?.description
                          ? product.description.split(" ").slice(0, 15).join(" ") +
                            (product.description.split(" ").length > 15 ? "..." : "")
                          : "No description available"}
                      </p>

                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {formatCurrency(item?.price || 0)}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item?.qty || 1}</p>
                        <p className="text-xs text-gray-500 uppercase">
                          {order.paymentMethod || "COD"}
                        </p>
                        <span
                          className={`text-xs font-semibold mb-3 ${getStatusStyle(order.status)}`}
                        >
                          {order.status || "Pending"}
                        </span>
                        <p className="text-xs text-green-400 mt-1">
                          Ordered on: {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Track Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPopup(order);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                    >
                      <Eye className="h-3.5 w-3.5" /> Track
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Tracking Popup */}
            <AnimatePresence>
              {isOpen && selectedOrder && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="bg-white rounded-xl p-4 w-96 shadow-lg relative max-h-[80vh] overflow-y-auto"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-md font-semibold mb-3">Track Order</h3>

                    <div className="relative ml-5">
                      {/* Vertical Line Background */}
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                      {/* Vertical Progress Fill */}
                      <motion.div
                        className="absolute left-2 top-0 w-0.5 bg-green-500"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${
                            (getTrackingDetails(selectedOrder).filter((step) => step.completed).length /
                              trackingSteps.length) * 100
                          }%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      ></motion.div>

                      {/* Steps */}
                      {getTrackingDetails(selectedOrder).map((step, index) => (
                        <motion.div
                          key={step.key}
                          className="flex items-start gap-2 mb-6 relative z-10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {/* Step Circle */}
                          <motion.div
                            className={`w-4 h-4 rounded-full mt-1 border-2 ${
                              step.completed ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                            }`}
                            animate={{
                              scale: step.completed ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                              duration: step.completed ? 0.4 : 0,
                              ease: "easeInOut",
                            }}
                          ></motion.div>

                          {/* Step Content */}
                          <div className="text-sm">
                            <p
                              className={`font-medium mb-2 ${
                                step.completed ? "text-gray-800" : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </p>
                            {step.date && (
                              <motion.p
                                className="text-xs text-gray-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                              >
                                {formatDate(step.date)}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={closePopup}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl leading-none"
                    >
                      ×
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
              {orders.map((order) => {
                const total = extractOrderTotal(order);
                return (
                  <div
                    key={`card-${order._id}`}
                    className="space-y-3 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                          #{order.orderNumber || "-"}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-[#2F251F]">
                          {formatCurrency(total)}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-[#2F251F]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items</span>
                        <span>{order.items?.length || 0}</span>
                      </div>
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium">{order.shippingAddress?.recipientName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Placed on</p>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View details
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openPopup(order);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> Track
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm shadow-sm md:flex-row md:px-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;