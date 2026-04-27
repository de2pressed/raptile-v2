"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";

const commandLinks = [
  { href: "/shipping", label: "shipping_policy", command: "shipping" },
  { href: "/returns", label: "returns", command: "returns" },
  { href: "/size-guide", label: "size_guide", command: "size" },
  { href: "/studio-inquiry", label: "studio_inquiry", command: "inquiry" },
  { href: "/privacy-policy", label: "privacy_policy", command: "privacy" },
  { href: "/terms", label: "terms", command: "terms" },
];

export function Footer() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const commandMap = useMemo(
    () =>
      new Map(
        commandLinks.flatMap((link) => [
          [link.command, link.href],
          [link.label, link.href],
        ]),
      ),
    [],
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = value.trim().toLowerCase().replace(/^\//, "");

    if (!normalized) {
      return;
    }

    const href = commandMap.get(normalized);

    if (!href) {
      setError("> ERROR: COMMAND NOT RECOGNIZED");
      return;
    }

    setError("");
    setValue("");
    router.push(href);
  };

  return (
    <footer className="relative z-10 px-4 pb-8 pt-10 md:px-6 md:pb-10 md:pt-16">
      <GlassPanel className="mx-auto max-w-[1440px] rounded-[32px] px-5 py-6 md:px-8 md:py-8">
        <div className="t-ui flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>RAPTILE STUDIO © 2026</span>
          <span>SIGNAL ORIGIN: INDIA</span>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {commandLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="t-ui rounded-full px-3 py-2 transition duration-200 hover:text-[color:var(--accent-strong)] hover:shadow-amber"
            >
              {`> EXECUTE /${item.label}`}
            </Link>
          ))}
        </div>
        <form className="mt-8" onSubmit={onSubmit}>
          <div className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] px-4 py-3">
            <input
              aria-label="Command input"
              className="terminal-input t-ui"
              onChange={(event) => {
                setValue(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              placeholder="[INPUT COMMAND]_"
              value={value}
            />
          </div>
          {error ? <div className="t-ui mt-3 text-[color:var(--accent-strong)]">{error}</div> : null}
        </form>
      </GlassPanel>
    </footer>
  );
}
