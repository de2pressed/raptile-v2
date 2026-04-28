import Link from "next/link";
import type { PropsWithChildren } from "react";

interface SupportPageFrameProps extends PropsWithChildren {
  title: string;
}

export function SupportPageFrame({ title, children }: SupportPageFrameProps) {
  return (
    <div id="top" className="mx-auto w-full max-w-[1120px] py-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-3">
          <h1 className="t-display text-[color:var(--text)]">{title}</h1>
          <p className="t-ui text-[color:var(--text-muted)]">Support details, policies, and practical information.</p>
        </div>
        <div className="rounded-[32px] border border-[color:var(--glass-border)] bg-[color:color-mix(in_oklch,var(--glass-fill)_78%,var(--bg))] px-6 py-8 md:px-10 md:py-10">
          <div className="support-content">{children}</div>
          <div className="mt-8 flex justify-end">
            <Link
              className="t-ui text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--text)]"
              href="#top"
            >
              Back to top
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
