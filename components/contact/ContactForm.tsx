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
  const statusMessage = status === "success" || status === "error" ? feedback : "";

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
    <form aria-busy={status === "loading"} className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="t-label">Name</span>
          <input
            className="contact-input"
            autoComplete="name"
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
            autoComplete="email"
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
          autoComplete="off"
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
          className="btn-primary w-full rounded-full px-5 py-3 sm:w-auto disabled:cursor-wait disabled:opacity-55"
          disabled={status === "loading"}
          type="submit"
        >
          <span className="t-label text-[color:var(--bg)]">{status === "loading" ? "Sending..." : "Send Message"}</span>
        </button>
        {statusMessage ? (
          <p
            aria-atomic="true"
            aria-live="polite"
            className={`t-ui ${status === "error" ? "text-[color:var(--accent-strong)]" : "text-[color:var(--text-muted)]"}`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
