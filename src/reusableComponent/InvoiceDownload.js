import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

export default function InvoiceDownload({ order }) {
  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt" });
    const margin = 14;
    let y = 20;

    // --- Title & Order Info ---
    doc.setFontSize(18);
    doc.text("Invoice", margin, y);
    doc.setFontSize(11);
    y += 20;
    doc.text(`Order #: ${order.orderNumber}`, margin, y);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 300, y);
    y += 12;
    doc.text(`Status: ${order.status?.toUpperCase()}`, margin, y);
    y += 20;

    // --- Customer & Shipping Info ---
    const addr = order.shippingAddress || {};
    doc.setFontSize(12);
    doc.text("Customer & Shipping Info", margin, y);
    y += 12;
    doc.setFontSize(10);
    doc.text(`Name: ${addr.recipientName}`, margin, y);
    doc.text(`Phone: ${addr.phone}`, 300, y);
    y += 12;
    doc.text(`Address: ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`, margin, y);
    y += 20;

    // --- Payment Info ---
    doc.setFontSize(12);
    doc.text("Payment Info", margin, y);
    y += 12;
    doc.setFontSize(10);
    doc.text(`Method: ${order.paymentMethod}`, margin, y);
    doc.text(`Status: ${order.paymentStatus}`, 300, y);
    y += 20;

    // --- Items Table ---
    const tableColumn = ["#", "Product Name", "Qty", "Price", "Total"];
    const tableRows = [];
    order.items?.forEach((item, i) => {
      tableRows.push([
        i + 1,
        item.name,
        item.qty,
        `₹${item.price}`,
        `₹${item.qty * item.price}`,
      ]);
    });

    autoTable(doc, {
      startY: y,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [255, 193, 7], textColor: 0 },
      styles: { fontSize: 10, cellPadding: 4 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // --- Summary ---
    doc.setFontSize(11);
    doc.text(`Subtotal: ₹${order.subtotal}`, margin, finalY);
    doc.text(`Shipping: ${order.shippingMethod}`, 300, finalY);
    doc.setFontSize(12);
    doc.text(`Total: ₹${order.total}`, margin, finalY + 18);

    // --- Footer ---
    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", margin, finalY + 40);

    // Save PDF
    doc.save(`Invoice_${order.orderNumber}.pdf`);
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
}
