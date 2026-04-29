import { SizeChartTable } from "@/components/shop/SizeChartTable";
import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

const guides = [
  {
    title: "Chest",
    body: "Lay the tee flat and measure straight across the chest from one armpit seam to the other.",
    icon: (
      <svg aria-hidden className="h-10 w-10 text-[color:var(--accent)]" fill="none" viewBox="0 0 24 24">
        <path d="M6 8h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M4.5 11.5h15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M4.5 16.5h15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "Length",
    body: "Measure from the highest point of the shoulder straight down to the hem of the tee.",
    icon: (
      <svg aria-hidden className="h-10 w-10 text-[color:var(--accent)]" fill="none" viewBox="0 0 24 24">
        <path d="M12 4v16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="m8 8 4-4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="m8 16 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "Shoulder",
    body: "Measure straight across the back from one shoulder seam to the other.",
    icon: (
      <svg aria-hidden className="h-10 w-10 text-[color:var(--accent)]" fill="none" viewBox="0 0 24 24">
        <path d="M5 15c3-5 11-5 14 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M8 9h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  },
];

export default function SizeGuidePage() {
  return (
    <SupportPageFrame title="Size Guide">
      <div className="grid gap-8">
        <section className="max-w-[46rem] space-y-4">
          <h2 className="support-heading">Oversized Tee Measurements</h2>
          <p className="text-[1.1rem] leading-[1.7] text-[color:var(--text-muted)] md:text-[1.2rem]">
            Compare the measurements below with a tee you already own, measured flat. The fit is intentionally oversized,
            so a size down usually reads closer to a standard fit.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className="noise-surface rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] p-5"
            >
              <div className="flex items-center gap-4">
                {guide.icon}
                <div>
                  <div className="t-label text-[color:var(--text-muted)]">{guide.title}</div>
                  <div className="mt-2 text-[color:var(--text)]">{guide.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SizeChartTable />
      </div>
    </SupportPageFrame>
  );
}
