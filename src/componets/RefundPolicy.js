import React from "react";
import AnimatePage from "../animation/AnimatePage.jsx";

const refundSections = [
  {
    title: "1. Eligibility Window",
    paragraphs: [
      "Refund requests must be submitted within 14 days of delivery unless a longer period is required by local consumer protection laws.",
      "Items must remain unused, in original packaging, and include all accessories, tags, or documentation provided by the vendor."
    ]
  },
  {
    title: "2. Non-Returnable Items",
    paragraphs: [
      "Certain products are final sale and not eligible for refunds. This includes perishable goods, personalized or custom-made items, intimate apparel, and digital downloads once accessed.",
      "If a product listing specifically states \"non-returnable\" or \"final sale,\" the vendor will not accept returns unless the item arrives damaged or defective."
    ]
  },
  {
    title: "3. Damaged or Defective Products",
    paragraphs: [
      "If you receive a damaged, defective, or incorrect item, report the issue within 48 hours of delivery. Provide photos or videos documenting the condition of the product and packaging.",
      "ENS will coordinate with the vendor to arrange a replacement or refund. In some cases, we may request that the original item be returned before a refund is issued."
    ]
  },
  {
    title: "4. Return Shipping",
    paragraphs: [
      "Return shipping instructions are provided after your refund request is approved. Some vendors may offer prepaid labels; otherwise, you are responsible for return shipping costs.",
      "Packages must be shipped using a trackable service. Refunds may be delayed if tracking information is not provided."
    ]
  },
  {
    title: "5. Refund Timeline",
    paragraphs: [
      "Once the returned item is received and inspected, the refund will be processed to your original payment method within 7-10 business days. Processing times may vary depending on your financial institution.",
      "If a refund is approved but not received, contact your bank or payment provider. If you still require assistance, reach out to ENS support with your case number."
    ]
  },
  {
    title: "6. Store Credit & Partial Refunds",
    paragraphs: [
      "When items show signs of use or missing accessories, vendors may offer a partial refund or store credit based on the condition of the return.",
      "Promotional items or bundled products must be returned together to qualify for a full refund. Otherwise, the value of the missing items may be deducted."
    ]
  },
  {
    title: "7. Order Cancellations",
    paragraphs: [
      "Orders may be canceled without penalty if the request is received before the vendor ships the item. Once an item is dispatched, standard return procedures apply.",
      "Subscription services or recurring orders can be canceled at any time, but charges already processed are non-refundable unless mandated by local law."
    ]
  }
];

export default function RefundPolicy() {
  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Refund Policy
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#241d1a] sm:text-5xl">
              Hassle-Free Returns
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#4c4643] sm:text-lg">
              We want you to love every purchase from ENS. Review our refund guidelines to understand
              how we support replacements, returns, and cancellations across our marketplace.
            </p>
          </header>

          <div className="space-y-10">
            {refundSections.map(({ title, paragraphs }) => (
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
            <h3 className="text-lg font-semibold text-[#241d1a]">Need Support?</h3>
            <p className="mt-3">
              Contact our returns desk at{" "}
              <a className="font-semibold text-amber-600 hover:text-amber-500" href="mailto:returns@ens.com">
                returns@ens.com
              </a>{" "}
              or call <span className="font-semibold text-[#241d1a]">123-456-7890</span>. Include your
              order number to expedite assistance.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[#78716c]">
              Policy Revised: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
