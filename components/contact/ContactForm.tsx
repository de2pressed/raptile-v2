"use client";

import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  orderNumber: "",
  message: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to send your message.");
      }

      setStatus("success");
      setFeedback("Message sent. We'll get back to you soon.");
      setFormData(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send your message.");
    }
  };

  return (
    <form className="contact-form space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="t-label">Name</span>
          <input
            className="contact-input"
            name="name"
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            required
            type="text"
            value={formData.name}
          />
        </label>
        <label className="space-y-2">
          <span className="t-label">Email</span>
          <input
            className="contact-input"
            name="email"
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={formData.email}
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="t-label">Order Number (Optional)</span>
        <input
          className="contact-input"
          name="orderNumber"
          onChange={(event) => setFormData((current) => ({ ...current, orderNumber: event.target.value }))}
          type="text"
          value={formData.orderNumber}
        />
      </label>

      <label className="space-y-2">
        <span className="t-label">Message</span>
        <textarea
          className="contact-input min-h-[180px] resize-y"
          name="message"
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          required
          value={formData.message}
        />
      </label>

      <div className="flex flex-col items-start gap-3">
        <button
          className="glass-panel group relative isolate overflow-hidden rounded-full border border-[color:var(--glass-border)] px-5 py-3 text-left transition duration-200 before:rounded-full hover:amber-border disabled:cursor-wait disabled:opacity-55"
          disabled={status === "loading"}
          type="submit"
        >
          <span className="relative z-[1] flex min-h-[1.1rem] items-center justify-center gap-1.5">
            {status === "loading" ? (
              <span className="flex items-center gap-1.5" aria-label="Sending">
                <span className="loading-dot animation-delay-0" />
                <span className="loading-dot animation-delay-150" />
                <span className="loading-dot animation-delay-300" />
              </span>
            ) : (
              <span className="t-label">Send Message</span>
            )}
          </span>
        </button>
        {feedback ? (
          <p className={`t-ui ${status === "error" ? "text-[color:var(--accent-strong)]" : "text-[color:var(--text-muted)]"}`}>
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
