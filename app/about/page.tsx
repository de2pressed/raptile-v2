import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const heroSignals = [
  "Two students / one cleaner standard",
  "Indian weather / exact fits",
  "Heavyweight cloth / precise wash",
  "Identity comes from silhouette, not noise",
] as const;

const processNotes = [
  "Built in India, finished with intent.",
  "Heavyweight cloth and exact wash.",
  "Short release windows, no filler.",
  "Identity comes from silhouette, not noise.",
] as const;

const stayTheSame = [
  "A disciplined frame that lets the garment lead.",
  "A refusal to copy loud references or borrowed identity.",
  "A fit process that keeps coming back to real wear.",
  "A release rhythm that stays deliberate, not chaotic.",
] as const;

const pillars = [
  {
    eyebrow: "01 / Founders",
    title: "Two students, one refusal to look generic.",
    body:
      "Raptile started with the feeling that Indian streetwear was often either overworked or borrowed. The goal was to make something original, exacting, and hard to mistake for a template.",
  },
  {
    eyebrow: "02 / Philosophy",
    title: "Built for Indian weather, movement, and repeat wear.",
    body:
      "The cut, weight, and wash are tuned for heat, humidity, motion, and repeated wear. The goal is not to imitate a western archive, but to make pieces that feel finished here.",
  },
  {
    eyebrow: "03 / Process",
    title: "Design decisions stay close to the cloth.",
    body:
      "Every release is checked against drape, shoulder shape, collar density, and how the garment holds after a real day outside. If the piece does not feel fully considered, it does not ship.",
  },
  {
    eyebrow: "04 / Future",
    title: "A label that can lead without shouting.",
    body:
      "The vision is not scale for its own sake. It is a body of work that feels sharper with every drop, strong enough to stay current without chasing the crowd.",
  },
] as const;

function PillarRow({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) {
  const reverse = index % 2 === 1;

  return (
    <article className="border-t border-[color:var(--glass-border)] pt-6 md:pt-8">
      <div
        className={cn(
          "grid gap-5 lg:gap-10",
          reverse ? "lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)]" : "lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)]",
        )}
      >
        <div className={cn("space-y-3", reverse && "lg:order-2 lg:text-right")}>
          <div className="t-label text-[color:var(--text-muted)]">{pillar.eyebrow}</div>
          <p className="editorial-copy max-w-[32ch] text-[color:var(--text-muted)]">
            {pillar.body}
          </p>
        </div>

        <div className={cn("space-y-4", reverse && "lg:order-1")}>
          <h3
            className={cn(
              "font-display text-[clamp(1.85rem,4.2vw,3.7rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]",
              reverse && "lg:text-right",
            )}
          >
            {pillar.title}
          </h3>
          <div className={cn("h-px w-24 bg-[color:var(--accent-subtle)]", reverse && "lg:ml-auto")} />
        </div>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] py-4 md:py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
        <div className="space-y-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
              <span>About Raptile Studio</span>
              <span aria-hidden>/</span>
              <span>Built in India</span>
              <span aria-hidden>/</span>
              <span>Small runs, clear point of view</span>
            </div>

            <h1 className="t-hero max-w-[12ch] text-[color:var(--text)]">
              Built by two students who wanted Indian streetwear to feel sharper.
            </h1>

            <p className="editorial-copy max-w-[38ch]">
              Raptile is shaped by long campus nights, early sample rounds, and the decision to make something
              original enough to stand up straight. The aim is not to look loud. The aim is to look finished.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
              <span className="inline-flex items-center gap-2 t-label text-[color:var(--bg)]">
                <span>View Collection</span>
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/contact">
              <span className="t-label">Contact the Studio</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroSignals.map((signal) => (
              <span
                key={signal}
                className="inline-flex items-center rounded-full border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-2 t-ui text-[color:var(--text-muted)]"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:pt-2">
          <GlassPanel className="rounded-[34px] px-5 py-5 md:px-7 md:py-7">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <BrandLogo size="lg" className="w-fit" />
                <div className="t-ui text-[color:var(--text-subtle)]">Studio note</div>
              </div>

              <div className="space-y-2">
                <div className="t-label text-[color:var(--text-muted)]">Manifesto</div>
                <p className="font-display text-[clamp(1.7rem,3.8vw,2.55rem)] font-bold tracking-[-0.04em] leading-[0.98] text-[color:var(--text)]">
                  Well executed, disruptive, and polished to the brim.
                </p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="rounded-[34px] px-5 py-5 md:px-7 md:py-7">
            <div className="space-y-5">
              <div className="t-label text-[color:var(--text-muted)]">Process notes</div>
              <ol className="space-y-3">
                {processNotes.map((note, index) => (
                  <li
                    key={note}
                    className="flex items-start gap-4 rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-3"
                  >
                    <span className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="t-ui leading-7 text-[color:var(--text-muted)]">{note}</span>
                  </li>
                ))}
              </ol>
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.76fr)] lg:items-start">
          <div className="space-y-6">
            <div className="t-label text-[color:var(--text-muted)]">Founders story</div>
            <h2 className="t-display max-w-[11ch] text-[color:var(--text)]">
              Started after class, kept alive by the urge to do it properly.
            </h2>
            <p className="editorial-copy max-w-[40ch]">
              The first samples were a response to how often shirts felt either overdesigned or undercooked. The
              founders kept returning to the same questions: what if the fabric could carry the mood, what if the fit
              could stay clean, and what if the label could speak with precision.
            </p>
            <p className="editorial-copy max-w-[40ch]">
              That direction stayed intact as the work moved from one sample to the next. Less graphics, better weight,
              smaller runs, and a stronger read on the body. The brand did not grow out of chasing trends. It grew out
              of repeated wear tests and the discipline to cut anything that dulled the point of view.
            </p>
          </div>

          <GlassPanel className="rounded-[34px] px-6 py-6 md:px-8 md:py-8">
            <div className="space-y-5">
              <div className="t-label text-[color:var(--text-muted)]">What stayed the same</div>
              <div className="grid gap-4">
                {stayTheSame.map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "flex gap-3 border-t border-[color:var(--glass-border)] pt-4 first:border-t-0 first:pt-0",
                    )}
                  >
                    <div className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
                    <div className="t-ui leading-7 text-[color:var(--text-muted)]">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="space-y-4">
          {pillars.map((pillar, index) => (
            <PillarRow key={pillar.eyebrow} index={index} pillar={pillar} />
          ))}
        </div>
      </section>

      <section className="pt-16 md:pt-20">
        <div className="grid gap-6 border-t border-[color:var(--glass-border)] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-start">
          <div className="space-y-4">
            <div className="t-label text-[color:var(--text-muted)]">Where it is going</div>
            <h2 className="t-display max-w-[12ch] text-[color:var(--text)]">
              The long-term goal is simple: make a label people trust because every drop lands polished.
            </h2>
            <p className="editorial-copy max-w-[40ch]">
              Raptile is moving toward a tighter archive of pieces that stay useful across seasons, cities, and repeat
              wear. Each drop should earn its place by being clear, well executed, and easy to come back to.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary rounded-full px-5 py-3.5" href="/collection">
                <span className="inline-flex items-center gap-2 t-label text-[color:var(--bg)]">
                  <span>Browse the Collection</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
              <Link className="ghost-button rounded-full px-5 py-3.5 text-[color:var(--text)]" href="/contact">
                <span className="t-label">Contact the Studio</span>
              </Link>
            </div>
          </div>

          <GlassPanel className="rounded-[34px] px-6 py-6 md:px-8 md:py-8">
            <div className="space-y-4">
              <div className="t-label text-[color:var(--text-muted)]">
                What being built in India means
              </div>
              <p className="t-ui leading-7 text-[color:var(--text-muted)]">
                It means making for the weather, the pace, and the way people move here. It means real context, sharp
                judgment, and a refusal to flatten the brand into someone else&apos;s streetwear template.
              </p>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
