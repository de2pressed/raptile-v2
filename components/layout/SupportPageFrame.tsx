import Link from "next/link";
import type { PropsWithChildren } from "react";

interface SupportPageFrameProps extends PropsWithChildren {
  title: string;
}

export function SupportPageFrame({ title, children }: SupportPageFrameProps) {
  return (
    <div id="top" className="mx-auto w-full max-w-[1120px] py-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-3 lg:sticky lg:top-[88px]">
          <div className="t-label text-[color:var(--text-muted)]">Support</div>
          <h1 className="t-display text-[color:var(--text)]">{title}</h1>
          <p className="t-ui max-w-[18rem] leading-6 text-[color:var(--text-muted)]">
            Clear answers, direct language, no decorative detours.
          </p>
        </div>
        <div className="rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--bg-soft)] px-6 py-8 md:px-10 md:py-10">
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
