"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          productHandle: "newsletter",
          variantId: null,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to join the list.");
      }

      setStatus("success");
      setMessage(payload.message || "You're on the list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join the list.");
    }
  };

  return (
    <footer className="footer-shell noise-surface relative z-10 mt-16 w-full border-t border-[color:var(--glass-border)] px-4 pb-8 pt-10 md:mt-20 md:px-6 md:pt-12">
      <div className="relative z-[1] mx-auto max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:gap-8">
          <div className="max-w-[28rem] space-y-3">
            <BrandLogo />
            <p className="t-ui max-w-[22rem] leading-6 text-[color:var(--text-muted)]">
              Creative essentials from India. Heavyweight fits, precise cuts, slower drops.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="t-label text-[color:var(--text-muted)]">Newsletter</div>
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                Be first when the next drop lands.
              </h2>
              <p className="t-ui max-w-[30rem] text-[color:var(--text-muted)]">
                One email field, no clutter. Updates only when the studio has something worth opening.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                autoComplete="email"
                className="contact-input h-12 flex-1 rounded-full"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                type="email"
                value={email}
              />
              <button className="btn-primary rounded-full px-5 py-3.5" disabled={status === "loading"} type="submit">
                <span className="t-label text-[color:var(--bg)]">{status === "loading" ? "Joining" : "Sign Up"}</span>
              </button>
            </div>

            {message ? (
              <div
                className={cn(
                  "t-ui",
                  status === "error" ? "text-[color:var(--accent-strong)]" : "text-[color:var(--text-muted)]",
                )}
              >
                {message}
              </div>
            ) : null}
          </form>

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
