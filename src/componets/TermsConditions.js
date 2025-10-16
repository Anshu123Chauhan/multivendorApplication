import React from "react";
import AnimatePage from "../animation/AnimatePage.jsx";

const sections = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "These Terms & Conditions govern your access to and use of the ENS Enterprises multivendor marketplace, including any related mobile applications, APIs, and services.",
      "By creating an account, browsing, or purchasing through our platform, you agree to be bound by these Terms. If you do not agree, you must discontinue use of our services."
    ]
  },
  {
    title: "2. Account Responsibilities",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
      "ENS reserves the right to disable, suspend, or terminate accounts that violate these Terms or any applicable laws."
    ],
    list: [
      "Provide accurate and up-to-date registration information.",
      "Notify ENS immediately of any unauthorized use of your account.",
      "Refrain from sharing your login credentials with other individuals."
    ]
  },
  {
    title: "3. Marketplace Conduct",
    paragraphs: [
      "Our marketplace connects buyers and independent vendors. All parties must conduct transactions in good faith and comply with applicable laws."
    ],
    list: [
      "Buyers: Review product descriptions carefully before purchasing and follow our return/refund procedures where eligible.",
      "Vendors: Ensure listings are accurate, lawful, and include all mandatory disclosures. Fulfill orders promptly and respond to customer inquiries in a timely manner.",
      "All users: Do not upload or distribute any content that is defamatory, obscene, infringing, or otherwise harmful."
    ]
  },
  {
    title: "4. Orders, Payments, and Fees",
    paragraphs: [
      "Prices are displayed in your selected currency and include applicable taxes unless stated otherwise. ENS may apply service fees to cover payment processing, logistics, and platform maintenance.",
      "All payments are processed securely through approved third-party providers. ENS is not responsible for delays caused by payment gateways or financial institutions."
    ]
  },
  {
    title: "5. Shipping, Returns, and Refunds",
    paragraphs: [
      "Shipping times are estimates provided by vendors or logistics partners. Delays may occur due to customs, carrier disruptions, or circumstances beyond our control.",
      "Return and refund eligibility is subject to our published policies. ENS may mediate disputes but the final resolution may depend on vendor cooperation and evidence provided by both parties."
    ]
  },
  {
    title: "6. Intellectual Property",
    paragraphs: [
      "ENS and its licensors own all platform content, branding, and technology, excluding vendor-provided listings. You may not copy, modify, distribute, or reverse engineer any part of the service without prior written consent.",
      "By uploading content, vendors grant ENS a non-exclusive, worldwide, royalty-free license to display, store, and use the content solely for marketplace operations."
    ]
  },
  {
    title: "7. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, ENS is not liable for any indirect, incidental, punitive, or consequential damages arising from your use of the marketplace.",
      "Our total liability for any claim relating to the services is limited to the amount paid to ENS in the 12 months preceding the event giving rise to the claim."
    ]
  },
  {
    title: "8. Indemnification",
    paragraphs: [
      "You agree to indemnify and hold harmless ENS, its affiliates, directors, and employees from any claims, losses, liabilities, or expenses arising from your misuse of the platform, breach of these Terms, or violation of applicable laws."
    ]
  },
  {
    title: "9. Termination",
    paragraphs: [
      "ENS may suspend or terminate your access to the marketplace at any time for violations of these Terms, suspected fraudulent activity, or legal compliance reasons. You may terminate your account by contacting customer support; however, certain obligations and liabilities may survive termination."
    ]
  },
  {
    title: "10. Changes to These Terms",
    paragraphs: [
      "We may update these Terms periodically. Material changes will be posted on this page with a new effective date. Continued use of the services after the revision constitutes acceptance of the updated Terms."
    ]
  }
];

export default function TermsConditions() {
  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Terms & Conditions
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#241d1a] sm:text-5xl">
              Using ENS Responsibly
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#4c4643] sm:text-lg">
              These Terms outline the rules for buyers, vendors, and visitors engaging with the ENS
              multivendor marketplace. Please read them carefully before continuing to use our
              services.
            </p>
          </header>

          <div className="space-y-10">
            {sections.map(({ title, paragraphs, list }) => (
              <section key={title} className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-[#241d1a]">{title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#4c4643] sm:text-base">
                  {paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  {list && (
                    <ul className="space-y-2 pl-6">
                      {list.map((item) => (
                        <li key={item} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-dashed border-amber-300 bg-white p-8 text-sm text-[#4c4643] sm:text-base">
            <h3 className="text-lg font-semibold text-[#241d1a]">Questions About These Terms?</h3>
            <p className="mt-3">
              Contact our legal team at{" "}
              <a className="font-semibold text-amber-600 hover:text-amber-500" href="mailto:legal@ens.com">
                legal@ens.com
              </a>{" "}
              or reach out by phone at <span className="font-semibold text-[#241d1a]">123-456-7890</span>.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[#78716c]">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
