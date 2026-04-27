import Link from "next/link";

import { GlassPanel } from "@/components/ui/GlassPanel";

interface InfoTerminalPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Array<{ label: string; body: string }>;
}

export function InfoTerminalPage({ eyebrow, title, lead, sections }: InfoTerminalPageProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[1240px] items-center py-10 md:py-16">
      <GlassPanel className="w-full rounded-[36px] px-6 py-8 md:px-10 md:py-10">
        <div className="t-label text-[color:var(--accent-strong)]">{eyebrow}</div>
        <div className="t-hero mt-4 max-w-[12ch] text-4xl md:text-6xl">{title}</div>
        <div className="mt-5 max-w-[54rem] text-sm leading-7 text-[color:var(--text-muted)] md:text-base">
          {lead}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.label}
              className="rounded-[26px] border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] px-5 py-5"
            >
              <div className="t-label text-[color:var(--text-muted)]">{section.label}</div>
              <div className="t-ui mt-3 leading-7 text-[color:var(--text)]">{section.body}</div>
            </div>
          ))}
        </div>
        <Link
          className="t-label mt-8 inline-flex rounded-full border border-[color:var(--glass-border)] px-4 py-3 transition duration-200 hover:text-[color:var(--accent-strong)]"
          href="/"
        >
          [RETURN TO COLLECTION]
        </Link>
      </GlassPanel>
    </div>
  );
}
