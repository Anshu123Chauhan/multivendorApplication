import React from "react";
import AnimatePage from "../animation/AnimatePage.jsx";

const accessibilitySections = [
  {
    title: "1. Our Commitment",
    paragraphs: [
      "ENS Enterprises is committed to providing an inclusive digital experience for all shoppers, vendors, and partners. We strive to ensure that people of all abilities can navigate, understand, and engage with our multivendor marketplace."
    ]
  },
  {
    title: "2. Accessibility Standards",
    paragraphs: [
      "Our design and engineering teams reference the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as a benchmark when building and updating site features. We also stay informed about evolving accessibility laws and best practices across the regions we serve."
    ],
    list: [
      "Keyboard navigable interactive elements and logical tab order.",
      "Sufficient color contrast between text, icons, and background elements.",
      "Descriptive alternative text for meaningful imagery and actionable icons.",
      "Structured headings and semantic markup to aid screen reader interpretation."
    ]
  },
  {
    title: "3. Assistive Technology Compatibility",
    paragraphs: [
      "We test critical user journeys with leading assistive technologies, including screen readers, screen magnifiers, and voice control solutions. While compatibility may vary depending on device and browser combinations, we aim to support the latest versions of major browsers on desktop and mobile."
    ]
  },
  {
    title: "4. Continuous Improvement",
    paragraphs: [
      "Accessibility is an ongoing process. We regularly review new features, fix barriers identified through audits, and incorporate user feedback into our roadmap.",
      "If an accessibility issue prevents you from completing a task, please contact us so we can provide support and prioritize a fix."
    ]
  },
  {
    title: "5. Vendor Content",
    paragraphs: [
      "Vendors are responsible for the accessibility of the content they upload, including product descriptions, images, and documents. ENS provides guidance and tooling to encourage accessible listings and reserves the right to request updates that improve usability for all customers."
    ]
  },
  {
    title: "6. Feedback & Contact",
    paragraphs: [
      "We welcome your input. If you encounter an accessibility barrier or have suggestions for improvement, please reach out using the contact options below. We review every message and respond within 2 business days."
    ]
  }
];

export default function AccessibilityStatement() {
  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Accessibility Statement
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#241d1a] sm:text-5xl">
              Building An Inclusive Marketplace
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[#4c4643] sm:text-lg">
              Discover how ENS ensures that our digital experiences are accessible to people with
              disabilities and how you can get assistance when you need it.
            </p>
          </header>

          <div className="space-y-10">
            {accessibilitySections.map(({ title, paragraphs, list }) => (
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
            <h3 className="text-lg font-semibold text-[#241d1a]">Need Assistance?</h3>
            <p className="mt-3">
              Email us at{" "}
              <a className="font-semibold text-amber-600 hover:text-amber-500" href="mailto:accessibility@ens.com">
                accessibility@ens.com
              </a>{" "}
              or call <span className="font-semibold text-[#241d1a]">123-456-7890</span>. We can help
              complete purchases, describe products, or provide alternate formats on request.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[#78716c]">
              Statement Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
