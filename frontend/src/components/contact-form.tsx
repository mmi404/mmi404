"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_MESSAGE_LENGTH = 5000;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot: a real visitor never sees or fills this field (visually
    // hidden, not in tab order, autoComplete off). The backend's public
    // contact-messages contract (request body: messageBody/replyEmail/
    // replyPhone only) doesn't define a honeypot field today, so this is
    // handled entirely client-side — if a bot fills it, we pretend to
    // succeed without ever calling the API. If M4.5 ends up wanting the
    // honeypot value server-side too, wiring it into the request body below
    // is a small follow-up.
    const honeypot = String(formData.get("company") ?? "");
    if (honeypot.trim().length > 0) {
      setStatus("success");
      form.reset();
      return;
    }

    const messageBody = String(formData.get("messageBody") ?? "").trim();
    if (!messageBody) {
      setStatus("error");
      setErrorMessage("Please enter a message.");
      return;
    }
    if (messageBody.length > MAX_MESSAGE_LENGTH) {
      setStatus("error");
      setErrorMessage(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`);
      return;
    }

    const replyEmail = String(formData.get("replyEmail") ?? "").trim();
    const replyPhone = String(formData.get("replyPhone") ?? "").trim();

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageBody,
          ...(replyEmail ? { replyEmail } : {}),
          ...(replyPhone ? { replyPhone } : {}),
        }),
      });

      if (res.status === 201 || res.status === 200) {
        setStatus("success");
        form.reset();
        return;
      }

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage("You're sending messages too quickly. Please try again later.");
        return;
      }

      if (res.status === 400) {
        setStatus("error");
        setErrorMessage("That message couldn't be sent as written — please check it and try again.");
        return;
      }

      // 404/503/etc: the contact endpoint isn't deployed yet, or the
      // backend is unreachable. Expected until M4.5 ships.
      setStatus("error");
      setErrorMessage(
        "The contact form isn't connected yet — please check back soon, or reach out through one of the links above."
      );
    } catch (err) {
      console.error("[contact-form] submit failed", err);
      setStatus("error");
      setErrorMessage("Something went wrong sending that. Please try again later.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-raised p-6 text-sm text-primary">
        Thanks — your message has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot field: visually hidden, unreachable by keyboard, never
          filled by a real person. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="messageBody" className="text-sm text-secondary">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="messageBody"
          name="messageBody"
          required
          maxLength={MAX_MESSAGE_LENGTH}
          rows={5}
          className="rounded-xl border border-border-subtle bg-surface-raised px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent"
          placeholder="What would you like to say?"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="replyEmail" className="text-sm text-secondary">
            Email (optional)
          </label>
          <input
            id="replyEmail"
            name="replyEmail"
            type="email"
            className="rounded-xl border border-border-subtle bg-surface-raised px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="replyPhone" className="text-sm text-secondary">
            Phone (optional)
          </label>
          <input
            id="replyPhone"
            name="replyPhone"
            type="tel"
            className="rounded-xl border border-border-subtle bg-surface-raised px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent"
            placeholder="+1 555 555 5555"
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-accent-hover">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
