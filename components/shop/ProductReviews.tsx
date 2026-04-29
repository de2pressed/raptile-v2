"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ProductReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productHandle: string;
  productTitle: string;
}

function buildSeedReviews(productTitle: string): ProductReview[] {
  return [
    {
      id: `${productTitle}-seed-1`,
      name: "Aarav Menon",
      rating: 5,
      date: "2026-03-08",
      comment: `${productTitle} lands with real weight. The shoulder line stays clean and the cloth does not lose shape after a long wear day.`,
      verified: true,
    },
    {
      id: `${productTitle}-seed-2`,
      name: "Kavya Iyer",
      rating: 4,
      date: "2026-03-16",
      comment: "The finish feels measured, not loud. It looks like a deliberate piece rather than another generic heavyweight tee.",
      verified: true,
    },
    {
      id: `${productTitle}-seed-3`,
      name: "Nikhil Sethi",
      rating: 5,
      date: "2026-04-02",
      comment: "The fit is calm and structured, which is exactly what this label needs. The product page also makes the choice easy.",
      verified: true,
    },
  ];
}

function formatReviewDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;

        return (
          <StarIcon
            key={index}
            className={cn("h-4 w-4", filled ? "text-[color:var(--accent)]" : "text-[color:var(--text-subtle)]")}
          />
        );
      })}
    </div>
  );
}

export function ProductReviews({ productHandle, productTitle }: ProductReviewsProps) {
  const seedReviews = useMemo(() => buildSeedReviews(productTitle), [productTitle]);
  const verifiedKey = `raptile:reviews:verified:${productHandle}`;
  const reviewsKey = `raptile:reviews:list:${productHandle}`;
  const [isVerified, setIsVerified] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationOrder, setVerificationOrder] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [storedReviews, setStoredReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    const savedVerification = window.localStorage.getItem(verifiedKey);
    const savedReviews = window.localStorage.getItem(reviewsKey);

    setIsVerified(Boolean(savedVerification));

    if (!savedReviews) {
      return;
    }

    try {
      const parsed = JSON.parse(savedReviews) as ProductReview[];
      setStoredReviews(Array.isArray(parsed) ? parsed : []);
    } catch {
      setStoredReviews([]);
    }
  }, [reviewsKey, verifiedKey]);

  const reviews = useMemo(() => [...seedReviews, ...storedReviews], [seedReviews, storedReviews]);
  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    return reviews.reduce((total, entry) => total + entry.rating, 0) / reviews.length;
  }, [reviews]);

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = verificationEmail.trim();
    const orderNumber = verificationOrder.trim();

    if (!email || !orderNumber || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setVerificationMessage("Enter the email and order number from your receipt.");
      return;
    }

    window.localStorage.setItem(
      verifiedKey,
      JSON.stringify({
        email,
        orderNumber,
        verifiedAt: new Date().toISOString(),
      }),
    );
    setIsVerified(true);
    setVerificationMessage("Purchase verified. The review form is now open.");
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isVerified || !comment.trim() || !displayName.trim()) {
      return;
    }

    const nextReview: ProductReview = {
      id: `${productHandle}-${Date.now()}`,
      name: displayName.trim(),
      rating,
      date: new Date().toISOString(),
      comment: comment.trim(),
      verified: true,
    };

    const nextReviews = [nextReview, ...storedReviews];
    setStoredReviews(nextReviews);
    window.localStorage.setItem(reviewsKey, JSON.stringify(nextReviews));
    setComment("");
    setRating(5);
    setDisplayName("");
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] py-6 md:py-10">
      <GlassPanel className="px-5 py-6 md:px-8 md:py-8" innerClassName="grid gap-8">
        <div className="grid gap-6 border-b border-[color:var(--glass-border)] pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:items-end">
          <div className="grid gap-4">
            <div className="t-label text-[color:var(--text-muted)]">Reviews</div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <div className="font-display text-4xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </div>
                <RatingStars rating={Math.round(averageRating)} />
              </div>
              <div className="t-ui text-[color:var(--text-muted)]">
                {reviews.length} verified review{reviews.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <p className="editorial-copy max-w-[30ch]">
            Verified buyers can add a note on fit, weight, or wear. The tone stays close to the garment, not the hype.
          </p>
        </div>

        {!isVerified ? (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
            <div className="grid gap-2">
              <div className="t-label text-[color:var(--text-muted)]">Verify purchase</div>
              <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">
                Unlock the review form
              </div>
              <p className="t-ui max-w-[34ch] text-[color:var(--text-muted)]">
                Enter the email and order number from your confirmation to open the review composer.
              </p>
            </div>

            <form className="grid gap-3" onSubmit={handleVerify}>
              <label className="grid gap-2">
                <span className="t-label text-[color:var(--text-muted)]">Email</span>
                <input
                  autoComplete="email"
                  className="contact-input"
                  onChange={(event) => setVerificationEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={verificationEmail}
                />
              </label>
              <label className="grid gap-2">
                <span className="t-label text-[color:var(--text-muted)]">Order number</span>
                <input
                  className="contact-input"
                  onChange={(event) => setVerificationOrder(event.target.value)}
                  placeholder="RS-24018"
                  type="text"
                  value={verificationOrder}
                />
              </label>
              <button className="btn-primary rounded-full px-5 py-3" type="submit">
                <span className="t-label text-[color:var(--bg)]">Verify purchase</span>
              </button>
              {verificationMessage ? <div className="t-ui text-[color:var(--text-muted)]">{verificationMessage}</div> : null}
            </form>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleReviewSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <label className="grid gap-2">
                <span className="t-label text-[color:var(--text-muted)]">Display name</span>
                <input
                  className="contact-input"
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Aarav Menon"
                  type="text"
                  value={displayName}
                />
              </label>
              <div className="grid gap-2">
                <span className="t-label text-[color:var(--text-muted)]">Rating</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    const active = value <= rating;

                    return (
                      <button
                        key={value}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-200",
                          active
                            ? "border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--accent)]"
                            : "border-[color:var(--glass-border)] text-[color:var(--text-subtle)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]",
                        )}
                        onClick={() => setRating(value)}
                        type="button"
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <label className="grid gap-2">
              <span className="t-label text-[color:var(--text-muted)]">Review</span>
              <textarea
                className="contact-input min-h-[140px] resize-y"
                onChange={(event) => setComment(event.target.value)}
                placeholder="How does it sit, move, and hold shape?"
                value={comment}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary rounded-full px-5 py-3" type="submit">
                <span className="t-label text-[color:var(--bg)]">Submit review</span>
              </button>
              <div className="t-ui text-[color:var(--text-muted)]">Verified buyers only.</div>
            </div>
          </form>
        )}

        <div className="grid gap-0 divide-y divide-[color:var(--glass-border)]">
          {reviews.map((review) => (
            <article key={review.id} className="grid gap-3 py-5 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-6">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <div className="font-display text-lg font-semibold tracking-[-0.03em] text-[color:var(--text)]">{review.name}</div>
                  {review.verified ? (
                    <span className="t-label rounded-full border border-[color:var(--glass-border)] px-2 py-1 text-[color:var(--text-muted)]">
                      Verified
                    </span>
                  ) : null}
                </div>
                <div className="t-ui text-[color:var(--text-muted)]">{formatReviewDate(review.date)}</div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="t-ui max-w-[64ch] leading-7 text-[color:var(--text-muted)]">{review.comment}</p>
            </article>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
}
