import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";

const pillars = [
  {
    eyebrow: "01 / Founders",
    title: "Two college students, one shared frustration.",
    body:
      "Raptile started with the simple feeling that Indian streetwear was being told in someone else's language. The clothes were either too loud or too borrowed, and neither felt honest.",
  },
  {
    eyebrow: "02 / Philosophy",
    title: "Built for Indian weather, Indian movement, Indian life.",
    body:
      "The cut, weight, and wash are tuned for heat, humidity, movement, and repeated wear. The goal is not a copy of western minimalism, but a piece that belongs here first.",
  },
  {
    eyebrow: "03 / Process",
    title: "Design decisions stay close to the cloth.",
    body:
      "Every release is checked against drape, shoulder shape, collar density, and how the garment holds after a real day outside. If the piece does not feel settled, it does not ship.",
  },
  {
    eyebrow: "04 / Future",
    title: "A label that stays small enough to stay clear.",
    body:
      "The vision is not scale for its own sake. It is a body of work that feels considered, local, and durable enough to keep wearing until the next drop arrives on its own terms.",
  },
] as const;

const processNotes = [
  "Built in India, for India.",
  "Heavyweight cloth and controlled wash.",
  "Short release windows, not constant noise.",
  "Identity comes from fit, not graphics.",
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] py-4 md:py-8">
      <section className="grid gap-8 border-b border-[color:var(--glass-border)] pb-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
        <div className="space-y-6">
          <div className="t-label text-[color:var(--text-muted)]">About Raptile Studio</div>
          <h1 className="t-hero max-w-[12ch] text-[color:var(--text)]">
            Built by two students who wanted Indian streetwear to feel honest.
          </h1>
          <p className="editorial-copy max-w-[38ch]">
            Raptile is a label shaped by long campus nights, early sample rounds, and the decision to make something that
            felt local without looking provincial. The point is not to imitate a western archive. The point is to build a
            wardrobe that belongs to the place it comes from.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="t-label text-[color:var(--bg)]">View Collection</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/contact">
              <span className="t-label">Contact the Studio</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-panel rounded-[32px] px-5 py-5 md:px-7 md:py-7">
            <div className="grid gap-4">
              <BrandLogo size="lg" className="w-fit" />
              <div className="grid gap-2">
                <div className="t-label text-[color:var(--text-muted)]">Manifesto</div>
                <p className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                  Raw, grounded, and built around the people who will actually wear it.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {processNotes.map((note) => (
              <div key={note} className="glass-panel rounded-[26px] px-4 py-4">
                <div className="t-ui text-[color:var(--text-muted)]">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
          <div className="space-y-6">
            <div className="t-label text-[color:var(--text-muted)]">Founders story</div>
            <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">
              Started after class, kept alive by the need to make better tees.
            </h2>
            <p className="editorial-copy max-w-[40ch]">
              The first samples were not a brand exercise. They were a response to how hard it was to find shirts that felt
              serious without turning theatrical. The founders kept returning to the same questions: what if the fabric
              could carry the mood, what if the fit could stay calm, and what if the label could speak plainly.
            </p>
            <p className="editorial-copy max-w-[40ch]">
              That direction stayed intact as the work moved from one sample to the next. Less graphics, better weight,
              smaller runs, and a stronger read on the body. The brand did not grow out of trend hunting. It grew out of
              repeated wear tests and the discipline to cut whatever felt borrowed.
            </p>
          </div>

          <div className="glass-panel rounded-[32px] px-6 py-6 md:px-8 md:py-8">
            <div className="grid gap-5">
              <div className="t-label text-[color:var(--text-muted)]">What stayed the same</div>
              <div className="grid gap-4">
                {[
                  "A quiet tone that lets the cloth speak first.",
                  "A refusal to chase loud references or imported identity.",
                  "A fit process that keeps coming back to everyday wear.",
                  "A release rhythm that stays measured, not performative.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 border-t border-[color:var(--glass-border)] pt-4 first:border-t-0 first:pt-0">
                    <div className="t-label text-[color:var(--text-subtle)]">/</div>
                    <div className="t-ui text-[color:var(--text-muted)]">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-4">
          {pillars.map((pillar) => (
            <article key={pillar.eyebrow} className="grid gap-6 border-t border-[color:var(--glass-border)] pt-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:gap-10">
              <div className="t-label text-[color:var(--text-muted)]">{pillar.eyebrow}</div>
              <div className="grid gap-3">
                <h3 className="font-display text-3xl font-bold tracking-[-0.04em] text-[color:var(--text)] md:text-4xl">
                  {pillar.title}
                </h3>
                <p className="editorial-copy max-w-[46ch]">{pillar.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-6 border-t border-[color:var(--glass-border)] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Where it is going</div>
            <h2 className="t-display max-w-[12ch] text-[color:var(--text)]">
              The long-term goal is simple, a label people trust because it never talks over the product.
            </h2>
            <p className="editorial-copy max-w-[40ch]">
              Raptile is moving toward a tighter archive of pieces that stay useful across seasons, cities, and repeat wear.
              Each drop should earn its place quietly, with enough clarity that the garments feel like part of a lived-in
              wardrobe instead of a seasonal statement.
            </p>
          </div>

          <div className="glass-panel rounded-[32px] px-6 py-6 md:px-8 md:py-8">
            <div className="grid gap-3">
              <div className="t-label text-[color:var(--text-muted)]">What the studio means by built in India for India</div>
              <p className="t-ui leading-7 text-[color:var(--text-muted)]">
                It means making for the weather, the pace, and the way people move here. It means local references, local
                judgment, and a refusal to flatten the brand into someone else&apos;s streetwear template.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
