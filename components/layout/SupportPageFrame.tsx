import Link from "next/link";
import type { PropsWithChildren } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";

interface SupportPageFrameProps extends PropsWithChildren {
  title: string;
}

export function SupportPageFrame({ title, children }: SupportPageFrameProps) {
  return (
    <div id="top" className="mx-auto w-full max-w-[1120px] py-10 md:py-16">
      <div className="mb-8">
        <h1 className="t-display">{title}</h1>
      </div>
      <GlassPanel className="mx-auto max-w-[800px] rounded-[36px] px-6 py-8 md:px-12 md:py-12">
        <div className="support-content relative">{children}</div>
        <div className="mt-8 flex justify-end">
          <Link
            className="t-ui text-[color:var(--text-muted)] transition duration-200 hover:text-[color:var(--accent-strong)]"
            href="#top"
          >
            Back to top
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
