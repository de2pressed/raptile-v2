"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassPanel } from "@/components/ui/GlassPanel";

export function NotFoundTerminal() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <GlassPanel className="animate-pulse-amber max-w-[42rem] rounded-[34px] px-6 py-8 md:px-10 md:py-10">
        <div className="font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">SYSTEM ERROR — 0x404</div>
        <div className="terminal-rule mt-4">────────────────────────────</div>
        <div className="t-ui mt-5 space-y-2">
          <div>&gt; SIGNAL LOST</div>
          <div>&gt; REQUESTED NODE NOT</div>
          <div>&nbsp;&nbsp;FOUND IN DATABASE</div>
          <div>&gt; LAST KNOWN COORDINATE:</div>
          <div>{pathname}</div>
        </div>
        <div className="terminal-rule mt-6">────────────────────────────</div>
        <Link
          className="t-label mt-6 inline-flex rounded-full border border-[color:var(--glass-border)] px-4 py-3 transition duration-200 hover:text-[color:var(--accent-strong)]"
          href="/"
        >
          [RETURN TO COLLECTION →]
        </Link>
      </GlassPanel>
    </div>
  );
}
