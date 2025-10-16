import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import AnimatePage from "../animation/AnimatePage";

const contactMethods = [
  {
    title: "Talk With Us",
    description: "Connect with our stylists for order updates and size guidance.",
    icon: Phone,
    details: ["123-456-7890", "Mon – Sat · 9:00 AM – 9:00 PM IST"],
  },
  {
    title: "Email Support",
    description: "We reply to every note within 24 hours on business days.",
    icon: Mail,
    details: ["hello@ens.com", "careers@ens.com"],
  },
  {
    title: "Visit The Studio",
    description: "ENS Experience Centre, 27 Hudson Road, Jaipur 302001.",
    icon: MapPin,
    details: ["By appointment only", "Complimentary valet parking"],
  },
  {
    title: "Order Status",
    description: "Track deliveries, returns, and exchanges any time.",
    icon: Clock,
    details: ["My Account → Orders", "Support available 24/7"],
  },
];

const supportHighlights = [
  "Dedicated vendor success team for marketplace partners.",
  "Live order tracking and proactive delay notifications.",
  "Tailored styling advice for every new collection drop.",
];

const ResultAlert = ({ message, onClose }) => (
  <div className="flex items-start justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
    <p className="text-sm font-medium">{message}</p>
    <button
      type="button"
      onClick={onClose}
      className="ml-4 text-xs font-semibold uppercase tracking-wide text-green-700 hover:text-green-900"
    >
      Close
    </button>
  </div>
);

function Contact() {
  const { t } = useTranslation();
  const [result, setResult] = useState(false);
  const [checked, setChecked] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!checked) {
      setSubmitError("Please confirm you would like a copy of this conversation.");
      return;
    }

    emailjs
      .sendForm("service_l2ksv8s", "template_8s4azuh", event.target, "o5kuPMl1cvJzFGjkm")
      .then(() => {
        event.target.reset();
        setResult(true);
        setChecked(false);
      })
      .catch(() => {
        setSubmitError("We could not send your message. Please try again or use another channel.");
      });
  };

  return (
    <AnimatePage>
      <div className="bg-[#faf7f3] pb-20">
        <section className="relative overflow-hidden bg-[#37312F] py-20 text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
            <div className="space-y-6 lg:w-1/2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                We’re Here For You
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Concierge-level care for every ENS experience.
              </h1>
              <p className="text-white/70">
                Whether you’re curating a custom look or managing vendor inventory, our support
                stylists and operations team are here to help around the clock.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:1234567890"
                  className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-[#241d1a] transition hover:bg-white hover:text-[#241d1a]"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call 123-456-7890
                </a>
                <a
                  href="mailto:hello@ens.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email hello@ens.com
                </a>
              </div>
            </div>
            <div className="relative flex-1 rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur">
              <div className="grid gap-6 sm:grid-cols-2">
                {contactMethods.slice(0, 2).map(({ title, description }) => (
                  <div key={title} className="rounded-2xl border border-white/20 bg-black/20 p-6">
                    <p className="text-sm font-semibold text-amber-300">{title}</p>
                    <p className="mt-3 text-sm text-white/80">{description}</p>
                  </div>
                ))}
              </div>
              <div className="absolute -left-10 -bottom-10 hidden h-40 w-40 rounded-full border border-amber-300/40 lg:block" />
              <div className="absolute -right-16 top-10 hidden h-24 w-24 rounded-full border border-white/40 lg:block" />
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-16 w-full max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map(({ title, description, icon: Icon, details }) => (
              <div key={title} className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-[#37312F]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#241d1a]">{title}</h3>
                <p className="mt-2 text-sm text-[#4c4643]">{description}</p>
                <ul className="mt-3 space-y-1 text-sm font-medium text-[#37312F]">
                  {details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 w-full max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                  Dedicated Support
                </p>
                <h2 className="text-3xl font-bold text-[#241d1a]">Your ENS concierge at every step.</h2>
                <p className="text-base text-[#4c4643]">
                  From styling to seller onboarding, we tailor the experience for your goals. Share
                  a little about what you need and we’ll line up the right specialists.
                </p>
              </div>
              <div className="rounded-3xl border border-[#e4ddd6] bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-[#241d1a]">
                  <MessageSquare className="h-6 w-6 text-amber-500" />
                  <h3 className="text-lg font-semibold">Why clients choose ENS</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-[#4c4643]">
                  {supportHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-[#241d1a]">Send us a message</h3>
                  <p className="text-sm text-[#4c4643]">
                    We’ll get back to you within one business day with tailored support.
                  </p>
                </div>

                {result && (
                  <ResultAlert message={t("successSent")} onClose={() => setResult(false)} />
                )}

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="mt-2 w-full rounded-xl border border-[#e4ddd6] bg-white px-4 py-3 text-sm text-[#241d1a] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder={t("name")}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                      {t("yourEmail")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-2 w-full rounded-xl border border-[#e4ddd6] bg-white px-4 py-3 text-sm text-[#241d1a] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder={t("yourEmail")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="mt-2 w-full rounded-xl border border-[#e4ddd6] bg-white px-4 py-3 text-sm text-[#241d1a] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    placeholder="Tell us how we can help"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                    {t("message")}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-[#e4ddd6] bg-white px-4 py-3 text-sm text-[#241d1a] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    placeholder={t("message")}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-[#4c4643]">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border border-[#c8bebe]"
                    checked={checked}
                    onChange={() => setChecked((prev) => !prev)}
                  />
                  <span>{t("sentCopy")}</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#37312F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-[#241d1a]"
                >
                  <Send className="h-4 w-4" />
                  {t("sent")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </AnimatePage>
  );
}

export default Contact;
