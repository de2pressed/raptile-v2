"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";

const infoLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="noise-surface relative z-10 mt-16 w-full border-t border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] px-4 pb-8 pt-10 md:mt-20 md:px-6 md:pt-12">
      <div className="relative z-[1] mx-auto max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(2,minmax(0,220px))] md:gap-8">
          <div className="max-w-[28rem] space-y-3">
            <BrandLogo />
            <p className="t-ui max-w-[22rem] leading-6 text-[color:var(--text-muted)]">
              Minimal essentials from India. Heavyweight fits, reduced graphics, slower drops.
            </p>
          </div>

          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Studio</div>
            <div className="flex flex-col gap-3">
              {infoLinks.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link t-ui">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Contact</div>
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="footer-link t-ui">
                Contact
              </Link>
              <div className="t-ui text-[color:var(--text-muted)]">Based in India</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--glass-border)] pt-4 md:mt-12">
          <div className="flex flex-col gap-2 text-[color:var(--text-subtle)] md:flex-row md:items-center md:justify-between">
            <div className="t-label">Raptile Studio. All rights reserved.</div>
            <div className="t-label">Built in India</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
