"use client";

import { useState } from "react";

interface NotifyMeFormProps {
  productHandle: string;
  variantId?: string | null;
}

export function NotifyMeForm({ productHandle, variantId }: NotifyMeFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productHandle,
          variantId: variantId ?? null,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      setMessage(payload.message ?? "We'll let you know when this is back.");

      if (response.ok) {
        setEmail("");
      }
    } catch (error) {
      console.error("Notify request failed", error);
      setMessage("We'll let you know when this is back.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="t-label text-[color:var(--text-muted)]">This item is sold out.</div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          autoComplete="email"
          className="contact-input h-11 rounded-full"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          type="email"
          value={email}
        />
        <button
          className="btn-primary rounded-full px-[var(--space-4)] py-[var(--space-2)]"
          disabled={isSubmitting}
          type="submit"
        >
          <span className="t-label text-[color:var(--bg)]">{isSubmitting ? "Sending" : "Notify Me"}</span>
        </button>
      </div>
      {message ? <div className="t-ui text-[color:var(--text-muted)]">{message}</div> : null}
    </form>
  );
}
