"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/ui/GlassPanel";

const primaryLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/size-guide", label: "Size Guide" },
];

const secondaryLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="relative z-10 px-4 pb-8 pt-10 md:px-6 md:pb-10 md:pt-16">
      <GlassPanel className="mx-auto max-w-[1440px] rounded-[32px] px-5 py-6 md:px-8 md:py-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="space-y-3">
            <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em] md:text-3xl">
              RAPTILE STUDIO
            </Link>
            <div className="t-ui text-[color:var(--text-muted)]">© 2026 - Based in India</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              {primaryLinks.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link t-ui">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {secondaryLinks.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link t-ui">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>
    </footer>
  );
}
