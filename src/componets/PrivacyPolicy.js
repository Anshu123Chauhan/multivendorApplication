import React from "react";
import AnimatePage from "../animation/AnimatePage.jsx";

const policySections = [
  {
    title: "1. Overview",
    paragraphs: [
      "This Privacy Policy explains how ENS Enterprises (\"ENS\", \"we\", \"us\", or \"our\") collects, uses, and safeguards the personal information of visitors, customers, and vendors who engage with our multivendor marketplace.",
      "By accessing or using our platforms, you consent to the practices described in this policy. If you disagree with any part of this policy, please discontinue use of our services."
    ]
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "We collect information that you voluntarily provide and data automatically gathered while you interact with our services. The type of information includes:"
    ],
    list: [
      "Account details: name, email address, phone number, shipping and billing information.",
      "Vendor data: company name, tax information, payout preferences, and compliance documentation.",
      "Transaction records: orders placed, payment confirmations, refunds, and communication history.",
      "Usage data: device details, IP address, browser type, session duration, and navigation paths.",
      "Support interactions: messages sent to our customer service channels, including call recordings where applicable."
    ]
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: [
      "We use personal information to ensure the efficient operation of our marketplace and to provide a secure, tailored experience. This includes:"
    ],
    list: [
      "Processing orders, deliveries, returns, and refunds.",
      "Authenticating users and protecting against fraud or misuse of our services.",
      "Facilitating vendor onboarding, catalog management, and payout settlements.",
      "Sending service-related communications, marketing updates (with consent), and product recommendations.",
      "Improving site performance, personalizing content, and conducting analytics to enhance user satisfaction."
    ]
  },
  {
    title: "4. Sharing and Disclosure",
    paragraphs: [
      "We do not sell your personal information. We may share data with trusted third parties in the following circumstances:"
    ],
    list: [
      "Service providers and logistics partners who support order fulfillment, payment processing, analytics, and customer support.",
      "Business partners and vendors when necessary to complete your transactions or resolve disputes.",
      "Regulatory authorities or law enforcement agencies when required to comply with legal obligations or to protect our rights and users.",
      "Successors in the event of a merger, acquisition, or similar corporate restructuring that involves ENS assets."
    ]
  },
  {
    title: "5. Cookies and Tracking Technologies",
    paragraphs: [
      "We use cookies, pixels, and similar technologies to recognize your browser, remember your preferences, and deliver relevant content. You can adjust your browser settings to refuse cookies or alert you when cookies are being sent, though some features of the site may not function properly without them."
    ]
  },
  {
    title: "6. Data Retention and Security",
    paragraphs: [
      "We retain personal information only for as long as it is necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
      "Administrative, technical, and physical safeguards are implemented to protect data against unauthorized access, alteration, disclosure, or destruction. While we strive to protect your information, no security system is impenetrable, and we cannot guarantee absolute security."
    ]
  },
  {
    title: "7. Your Choices and Rights",
    paragraphs: [
      "Depending on your location, you may have the right to access, correct, update, or delete your personal information. You can manage communication preferences by adjusting your account settings or unsubscribing from promotional emails.",
      "To exercise your privacy rights or request a copy of the data we hold about you, please contact us using the details below. We may need to verify your identity before fulfilling your request."
    ]
  },
  {
    title: "8. Children's Privacy",
    paragraphs: [
      "Our services are not directed to children under the age of 13. If we learn that we have collected personal information from a child without verifiable parental consent, we will promptly delete that data."
    ]
  },
  {
    title: "9. Updates to This Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or technology. When we make material changes, we will post the updated policy on this page and revise the \"Last Updated\" date."
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Privacy Policy
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#241d1a] sm:text-5xl">
              Safeguarding Your Trust
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#4c4643] sm:text-lg">
              We believe transparency is essential. This policy outlines how ENS collects, uses,
              and shares the information you provide while interacting with our multivendor
              marketplace.
            </p>
          </header>

          <div className="space-y-10">
            {policySections.map(({ title, paragraphs, list }) => (
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
            <h3 className="text-lg font-semibold text-[#241d1a]">Questions or Requests?</h3>
            <p className="mt-3">
              Email us at{" "}
              <a className="font-semibold text-amber-600 hover:text-amber-500" href="mailto:privacy@ens.com">
                privacy@ens.com
              </a>{" "}
              or call <span className="font-semibold text-[#241d1a]">123-456-7890</span>. We are
              here to help you with any privacy concerns or data requests.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[#78716c]">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
