"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassPanel } from "@/components/ui/GlassPanel";

export function NotFoundPanel() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[72vh] items-center justify-center py-16">
      <GlassPanel className="animate-pulse-amber max-w-[42rem] rounded-[34px] px-6 py-8 md:px-10 md:py-10">
        <div className="font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">404 — Not Found</div>
        <div className="mono-rule mt-4">────────────────────────────────</div>
        <div className="t-ui mt-5 space-y-2 text-[color:var(--text-muted)]">
          <div>The page you&apos;re looking for</div>
          <div>doesn&apos;t exist.</div>
          <div>&nbsp;</div>
          <div>{pathname}</div>
        </div>
        <div className="mono-rule mt-6">────────────────────────────────</div>
        <Link
          className="t-label mt-6 inline-flex rounded-full border border-[color:var(--glass-border)] px-4 py-3 transition duration-200 hover:text-[color:var(--accent-strong)]"
          href="/collection"
        >
          Back to Collection -&gt;
        </Link>
      </GlassPanel>
    </div>
  );
}
