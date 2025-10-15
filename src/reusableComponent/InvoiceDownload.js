import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

export default function InvoiceDownload({ order }) {
  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", orientation: "portrait" });
    const margin = 40;
    let y = 40;

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 51, 102); // Dark blue for title
    doc.text("TAX INVOICE", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    y += 20;
    doc.text("ENS Enterprises", margin, y); // Replace with your company name
    doc.text("B-16 sector 63, NOIDA, Uttar Pradesh - 201307, India", margin, y + 10);
    doc.text("GSTIN: 07AABCU9603R1ZM", margin, y + 20); // Replace with your GSTIN
    doc.text("Email: contact@yourcompany.com | Phone: +91-123-456-7890", margin, y + 30);
    y += 50;

    // --- Horizontal Line ---
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 595 - margin, y); // A4 width: 595pt
    y += 20;

    // --- Order Info ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Order Information", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 15;
    doc.text(`Order #: ${order.orderNumber || "N/A"}`, margin, y);
    doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : "N/A"}`, 350, y);
    y += 12;
    doc.text(`Status: ${order.status ? order.status.toUpperCase() : "N/A"}`, margin, y);
    y += 12;
    doc.text(`Tracking URL: ${order.trackingUrl || "N/A"}`, margin, y);
    y += 20;

    // --- Customer & Shipping Info ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Customer & Shipping Information", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 15;
    const addr = order.shippingAddress || {};
    doc.text(`Name: ${addr.recipientName || "N/A"}`, margin, y);
    doc.text(`Phone: ${addr.phone || "N/A"}`, 350, y);
    y += 12;
    doc.text(
      `Address: ${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}, ${addr.country || ""}`,
      margin,
      y
    );
    y += 20;

    // --- Payment Info ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payment Information", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 15;
    doc.text(`Method: ${order.paymentMethod ? order.paymentMethod.toUpperCase() : "N/A"}`, margin, y);
    doc.text(`Status: ${order.paymentStatus ? order.paymentStatus.toUpperCase() : "N/A"}`, 350, y);
    y += 12;
    doc.text(`Transaction ID: ${order.ourPaymentTransactionId || "N/A"}`, margin, y);
    y += 20;

    // --- Items Table ---
    const tableColumn = ["#", "Product Name", "Description", "Qty", "Price", "Total"];
    const tableRows = order.items?.map((item, i) => [
      i + 1,
      item.name || "N/A",
      item.productId?.description || "N/A",
      item.qty || 0,
      item.price ? `₹${item.price.toFixed(2)}` : "N/A",
      item.qty && item.price ? `₹${(item.qty * item.price).toFixed(2)}` : "N/A",
    ]) || [];

    autoTable(doc, {
      startY: y,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [255, 193, 7], // Amber header
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray for alternate rows
      },
      columnStyles: {
        0: { cellWidth: 30, halign: "center" },
        1: { cellWidth: 120 },
        2: { cellWidth: 200 },
        3: { cellWidth: 50, halign: "center" },
        4: { cellWidth: 80, halign: "right" },
        5: { cellWidth: 80, halign: "right" },
      },
    });

    // --- Billing Summary ---
    y = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const subtotal = order.subtotal || 0;
    const shippingCost = order.shippingCost || 0;
    const gstRate = 0.18; // Assuming 18% GST (9% CGST + 9% SGST)
    const gstAmount = subtotal * gstRate;
    const totalWithGst = subtotal + shippingCost + gstAmount;

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, y);
    y += 12;
    doc.text(
      `Shipping: ${order.shippingMethod ? order.shippingMethod.toUpperCase() : "N/A"} (₹${shippingCost.toFixed(2)})`,
      350,
      y
    );
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total: ₹${subtotal.toFixed(2)}`, 350, y);

    // --- Footer ---
    y += 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 595 - margin, y);
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Thank you for shopping with us! For queries, contact us at contact@yourcompany.com.", margin, y);

    // --- Page Number ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Page 1 of 1`, 550, 800, { align: "right" });

    // Save PDF
    doc.save(`Invoice_${order.orderNumber || "unknown"}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-full hover:bg-amber-600 transition text-xs md:text-sm"
    >
      <Download className="w-4 h-4" />
      Download Invoice
    </button>
  );
};