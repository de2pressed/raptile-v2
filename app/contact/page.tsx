import Link from "next/link";

import { ContactForm } from "@/components/contact/ContactForm";

const supportNotes = [
  {
    title: "Sizing help",
    body: "If you are between sizes, we can point you toward the calmer fit.",
  },
  {
    title: "Order support",
    body: "Share an order number and we can trace the status quickly.",
  },
  {
    title: "Response time",
    body: "Most replies land within 1 to 2 business days.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] py-6 md:py-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-3 t-label text-[color:var(--text-muted)]">
            <span>Contact</span>
            <span aria-hidden>/</span>
            <span>Clear answers, direct language</span>
          </div>

          <div className="space-y-4">
            <h1 className="t-hero max-w-[10ch] text-[color:var(--text)]">
              Questions, orders, sizing, and anything between.
            </h1>
            <p className="editorial-copy max-w-[38ch]">
              Reach out for order support, sizing help, or general questions. We usually reply within 1 to 2 business
              days.
            </p>
          </div>

          <div className="grid gap-4">
            {supportNotes.map((note, index) => (
              <div key={note.title} className="grid gap-3 border-t border-[color:var(--glass-border)] pt-4 first:border-t-0 first:pt-0">
                <div className="t-label text-[color:var(--text-subtle)]">{String(index + 1).padStart(2, "0")}</div>
                <div className="font-display text-[clamp(1.25rem,2.6vw,1.65rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                  {note.title}
                </div>
                <div className="t-ui max-w-[28ch] leading-7 text-[color:var(--text-muted)]">{note.body}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="ghost-button rounded-full px-5 py-3 text-[color:var(--text)]" href="/size-guide">
              <span className="t-label">Size Guide</span>
            </Link>
            <Link className="ghost-button rounded-full px-5 py-3 text-[color:var(--text)]" href="/shipping">
              <span className="t-label">Shipping</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="t-label text-[color:var(--text-muted)]">Studio inbox</div>
              <div className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.04em] text-[color:var(--text)]">
                Tell us what you need.
              </div>
            </div>
            <div className="t-ui text-right text-[color:var(--text-subtle)]">Replies in 1 to 2 business days</div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
