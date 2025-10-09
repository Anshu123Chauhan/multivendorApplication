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
  const candidates = [
    order?.grandTotal,
    order?.totalAmount,
    order?.amount?.total,
    order?.pricing?.total,
  ];

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

  return numeric.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "-";
  }
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

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

  const handleDownloadInvoice = (order) => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 48;
      const contentWidth = pageWidth - marginX * 2;
      let cursorY = 72;

      const orderNumber = order.orderNumber || order._id || "";
      const invoiceTitle = orderNumber ? `Invoice #${orderNumber}` : "Invoice";
      const orderDate = formatDate(order.createdAt);
      const paymentMethod = order.paymentMethod || "-";
      const statusLabel = order.status || "Pending";

      doc.setFontSize(18);
      doc.setTextColor(39, 30, 27);
      doc.text(invoiceTitle, marginX, cursorY);

      doc.setFontSize(11);
      doc.setTextColor(96, 84, 72);
      cursorY += 20;
      doc.text(`Placed on: ${orderDate}`, marginX, cursorY);
      cursorY += 16;
      doc.text(`Payment method: ${paymentMethod}`, marginX, cursorY);
      cursorY += 16;
      doc.text(`Status: ${statusLabel}`, marginX, cursorY);

      const shipping = order.shippingAddress || {};
      const billingLine1 = shipping.recipientName || "-";
      const billingLine2 = [shipping.addressLine1, shipping.addressLine2].filter(Boolean).join(", ");
      const billingLine3 = [shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(", ");
      const billingContact = shipping.phone || shipping.email || "";

      doc.setFontSize(12);
      doc.setTextColor(39, 30, 27);
      cursorY += 32;
      doc.text("Bill To", marginX, cursorY);
      doc.setFontSize(11);
      doc.setTextColor(96, 84, 72);
      cursorY += 16;
      doc.text(billingLine1 || "Customer", marginX, cursorY);
      if (billingLine2) {
        cursorY += 14;
        doc.text(billingLine2, marginX, cursorY);
      }
      if (billingLine3) {
        cursorY += 14;
        doc.text(billingLine3, marginX, cursorY);
      }
      if (billingContact) {
        cursorY += 14;
        doc.text(billingContact, marginX, cursorY);
      }

      const items = Array.isArray(order.items) ? order.items : [];
      const itemRows = items.length
        ? items.map((item, index) => {
            const qty = Number(item?.quantity) || 1;
            const rawPrice = [item?.price, item?.unitPrice, item?.amount].find(
              (value) => value !== undefined && value !== null
            );
            const pricePerUnit = Number(
              rawPrice !== undefined && rawPrice !== null ? rawPrice : 0
            );
            const rawTotal = [item?.total, item?.totalPrice].find(
              (value) => value !== undefined && value !== null
            );
            const lineTotal = Number(
              rawTotal !== undefined && rawTotal !== null ? rawTotal : pricePerUnit * qty
            );
            const name = item?.name || item?.productName || item?.title || `Item ${index + 1}`;
            const attributes = Array.isArray(item?.attributes)
              ? item.attributes
                  .map((attr) => {
                    if (!attr?.type || !attr?.value) return null;
                    return `${attr.type}: ${attr.value}`;
                  })
                  .filter(Boolean)
              : [];
            const variantDetails = [item?.variantName, item?.sku, ...attributes].filter(Boolean).join(" | ");
            const description = variantDetails ? `${name}\n${variantDetails}` : name;

            return [
              String(index + 1),
              description,
              String(qty),
              formatCurrency(pricePerUnit),
              formatCurrency(lineTotal),
            ];
          })
        : [["-", "No items available", "-", "-", "-"]];

      const tableStartY = cursorY + 28;
      const firstColumnWidth = 32;
      const quantityColumnWidth = 60;
      const currencyColumnWidth = 90;
      const computedItemWidth = contentWidth - (firstColumnWidth + quantityColumnWidth + currencyColumnWidth * 2);
      const itemColumnWidth = Math.max(computedItemWidth, 160);

      autoTable(doc, {
        startY: tableStartY,
        margin: { left: marginX, right: marginX, top: 0, bottom: 32 },
        tableWidth: contentWidth,
        head: [["#", "Item", "Qty", "Price", "Total"]],
        body: itemRows,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
          textColor: [55, 41, 33],
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: [244, 185, 66],
          textColor: [39, 30, 27],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [252, 248, 242],
        },
        columnStyles: {
          0: { cellWidth: firstColumnWidth, halign: "center" },
          1: { cellWidth: itemColumnWidth, overflow: "linebreak" },
          2: { cellWidth: quantityColumnWidth, halign: "center" },
          3: { cellWidth: currencyColumnWidth, halign: "right" },
          4: { cellWidth: currencyColumnWidth, halign: "right" },
        },
      });

      const lastTable = doc.lastAutoTable;
      const totalsStartY = (lastTable?.finalY || tableStartY) + 24;

      const subtotal = Number(order.subTotal || order.subtotal || extractOrderTotal(order));
      const discount = Number(order.discount || order.couponAmount || 0);
      const shippingFee = Number(order.shippingFee || order.deliveryFee || 0);
      const taxAmount = Number(order.taxAmount || order.taxes?.total || 0);
      const grandTotal = extractOrderTotal(order);

      const summaryRows = [
        ["Subtotal", formatCurrency(subtotal)],
        ["Discount", discount ? `- ${formatCurrency(discount)}` : "-"],
        ["Shipping", shippingFee ? formatCurrency(shippingFee) : "Included"],
        ["Tax", taxAmount ? formatCurrency(taxAmount) : "Included"],
        ["Grand Total", formatCurrency(grandTotal)],
      ];

      const summaryTableWidth = Math.min(260, contentWidth);
      const summaryMarginLeft = marginX + contentWidth - summaryTableWidth;

      autoTable(doc, {
        startY: totalsStartY,
        margin: { left: summaryMarginLeft, right: marginX, top: 0, bottom: 24 },
        tableWidth: summaryTableWidth,
        body: summaryRows,
        theme: "plain",
        styles: {
          fontSize: 11,
          cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
          textColor: [55, 41, 33],
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
        },
      });

      const finalY = doc.lastAutoTable?.finalY || totalsStartY;
      let thankYouY = finalY + 32;

      if (thankYouY > pageHeight - marginX) {
        doc.addPage();
        thankYouY = marginX;
      }

      doc.setFontSize(10);
      doc.setTextColor(120, 104, 90);
      doc.text(
        "Thank you for shopping with us. For any assistance, reach out to support.",
        marginX,
        thankYouY,
        { maxWidth: contentWidth }
      );

      const fileName = orderNumber ? `invoice-${orderNumber}.pdf` : "invoice.pdf";
      doc.save(fileName);
    } catch (error) {
      console.error("Failed to generate invoice PDF", error);
    }
  };
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
            <div className="hidden rounded-2xl border border-amber-100 bg-white shadow-sm md:block">
              <table className="w-full table-fixed">
                <thead>
                  <tr className=" text-xs font-semibold uppercase tracking-normal text-gray-500">
                    <th className="px-3 py-3">Order</th>
                    <th className="px-3 py-3">Items</th>
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Payment</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Placed on</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50 text-sm">
                  {orders.map((order) => {
                    const total = extractOrderTotal(order);
                    return (
                      <tr key={order._id} className="transition hover:bg-amber-50/60">
                        <td className="px-3 py-2">
                          <p className="font-semibold text-[#2F251F] w-[10ch] truncate">{order.orderNumber || "-"}</p>
                          
                        </td>
                        <td className="px-3 py-2 text-[#2F251F]">{order.items?.length || 0}</td>
                        <td className="px-3 py-2">
                          <p className="font-medium text-[#2F251F]">{order.shippingAddress?.recipientName || "-"}</p>
                          <p className="text-xs text-gray-500">{order.shippingAddress?.phone || ""}</p>
                        </td>
                        <td className="px-3 py-2 text-[#2F251F]"><p className="text-xs text-gray-500">{formatCurrency(total)}</p>{order.paymentMethod || "-"}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[#2F251F]">{formatDate(order.createdAt)}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col justify-end gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-1 py-1 justify-center text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDownloadInvoice(order);
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-1 py-1 justify-center  text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                              <Download className="h-3.5 w-3.5" /> Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}>
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
                        <p className="font-medium">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-IN", {
                                hour12: true,
                              })
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View details
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDownloadInvoice(order);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

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


