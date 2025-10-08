import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const storeLinks = [
  { label: "Shop", to: "/shop" },
  { label: "Sale", to: "/shop" },
  { label: "Customer Care", to: "/contact" },
  { label: "Stores", to: "/shop" },
];

const policyLinks = [
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Shipping Policy", to: "/shipping" },
  { label: "Refund Policy", to: "/refund" },
  { label: "Accessibility Statement", to: "/accessibility" },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
];

export default function Footer() {
  const handleSubscribe = (event) => {
    event.preventDefault();
  };

  return (
    <footer className="bg-[#37312F] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-10 lg:py-14">
        <section className="flex-1 space-y-6">
          <h2 className="font-nunito text-2xl font-bold">ENS</h2>

          <div>
            <h3 className="font-nunito text-lg font-semibold">Our Store</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80 px-0">
              {storeLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link className="transition hover:text-amber-300" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1 text-sm text-white/80">
            <h3 className="font-nunito text-lg font-semibold text-white">Need Assistance?</h3>
            <p>123-456-7890</p>
            <a className="transition hover:text-amber-300" href="mailto:info@mysite.com">
              info@mysite.com
            </a>
          </div>
        </section>

        <section className="flex-1 space-y-6">
          <div>
            <h3 className="font-nunito text-lg font-semibold">Terms & Policies</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80 px-0">
              {policyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link className="transition hover:text-amber-300" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-nunito text-lg font-semibold">Stay Connected</h3>
            <div className="mt-4 flex flex-wrap gap-3 text-white/80">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:border-amber-300 hover:text-amber-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="flex-1 space-y-6">
          <div className="space-y-3">
            <h3 className="font-nunito text-lg font-semibold">Be Our Friend</h3>
            <p className="text-sm text-white/80">
              Subscribe for curated drops, offers, and styling tips.
            </p>
            <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-amber-300"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#37312F] transition hover:bg-amber-300 hover:text-[#241d1a]"
              >
                Subscribe
              </button>
            </form>
            <label className="flex items-start gap-2 text-xs text-white/70">
              <input type="checkbox" className="mt-1" />
              Yes, subscribe me to your newsletter.
            </label>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 bg-[#2f2927]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/70 sm:flex-row sm:px-6 lg:px-10">
          <p>Copyright {new Date().getFullYear()} ENS Enterprises. All rights reserved.</p>
          <p>Designed by Manvendra - Powered by ENS</p>
        </div>
      </div>
    </footer>
  );
}
