import React from "react";
import AnimatePage from "../animation/AnimatePage.jsx";

const shippingSections = [
  {
    title: "1. Dispatch & Processing",
    paragraphs: [
      "Orders placed through the ENS marketplace are fulfilled directly by our vendor partners. Each vendor maintains their own inventory and handling schedules.",
      "Most in-stock items ship within 2-4 business days. During promotional events or peak periods, processing may extend to 5-7 business days."
    ]
  },
  {
    title: "2. Delivery Windows",
    paragraphs: [
      "Estimated delivery times are calculated based on the vendor's location, the destination address, and the selected shipping method.",
      "Standard delivery typically arrives within 5-10 business days domestically and 10-21 business days for international orders. Express options are available for select routes and may incur additional charges."
    ]
  },
  {
    title: "3. Shipping Fees",
    paragraphs: [
      "Shipping fees are determined by the vendor and displayed at checkout before you confirm your order. Fees may vary depending on weight, dimensions, distance, and chosen service level.",
      "Combined orders from multiple vendors may ship separately, and each shipment will have its own associated fee."
    ]
  },
  {
    title: "4. Order Tracking",
    paragraphs: [
      "Once a shipment leaves the vendor, you will receive an email with tracking details. Tracking links can also be accessed through your ENS account under the Orders section.",
      "If tracking information appears delayed or unavailable, please allow up to 48 hours for carrier systems to update. Contact customer support if no updates are available after that period."
    ]
  },
  {
    title: "5. Customs & Duties",
    paragraphs: [
      "International shipments may be subject to customs inspections, duties, or taxes imposed by the destination country. These charges are the responsibility of the recipient.",
      "ENS and our vendors are not liable for delays caused by customs clearance or for any additional charges incurred."
    ]
  },
  {
    title: "6. Delivery Issues",
    paragraphs: [
      "If a package is marked as delivered but cannot be located, please contact the carrier and our support team within 48 hours. We will coordinate with the vendor to investigate.",
      "Packages returned to sender due to incorrect address information may incur reshipment fees. Please verify your delivery details carefully before submitting your order."
    ]
  },
  {
    title: "7. Order Modifications",
    paragraphs: [
      "After an order is confirmed, modifications to shipping address or method are not guaranteed. Requests submitted within 12 hours may be accommodated at the vendor's discretion.",
      "For cancellations, please refer to our Refund Policy. Orders already dispatched cannot be canceled."
    ]
  }
];

export default function ShippingPolicy() {
  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Shipping Policy
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#241d1a] sm:text-5xl">
              Delivering With Care
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#4c4643] sm:text-lg">
              Learn how ENS and our vendor partners process orders, calculate shipping fees, and
              handle delivery timelines to get your products safely to your door.
            </p>
          </header>

          <div className="space-y-10">
            {shippingSections.map(({ title, paragraphs }) => (
              <section key={title} className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-[#241d1a]">{title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#4c4643] sm:text-base">
                  {paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-dashed border-amber-300 bg-white p-8 text-sm text-[#4c4643] sm:text-base">
            <h3 className="text-lg font-semibold text-[#241d1a]">Need Help With Your Shipment?</h3>
            <p className="mt-3">
              Reach our logistics team at{" "}
              <a className="font-semibold text-amber-600 hover:text-amber-500" href="mailto:shipping@ens.com">
                shipping@ens.com
              </a>{" "}
              or call <span className="font-semibold text-[#241d1a]">123-456-7890</span>. Provide
              your order number for faster assistance.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[#78716c]">
              Policy Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
