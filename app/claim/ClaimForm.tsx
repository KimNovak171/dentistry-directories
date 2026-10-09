"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdznngq";

export function ClaimForm({ paymentUrl }: { paymentUrl?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const form = formRef.current;
    if (!form) return;

    const practiceName = form.elements.namedItem("business_name");
    const location = form.elements.namedItem("location");
    if (practiceName instanceof HTMLInputElement && !practiceName.value) {
      practiceName.value = params.get("business") ?? "";
    }
    if (location instanceof HTMLInputElement && !location.value) {
      location.value = params.get("location") ?? "";
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: "DentistryDirectories.com listing verification",
          ...payload,
        }),
      });

      if (!response.ok) throw new Error("Verification form submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-teal/30 bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-navy">Verification request received</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your listing is not yet verified. Complete the one-time $19 payment so
          we can match your payment to the request and place it in the next
          scheduled directory update.
        </p>
        {paymentUrl ? (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Continue to Secure Payment — $19
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white opacity-60 shadow-sm"
          >
            Continue to Secure Payment — $19
          </button>
        )}
        {!paymentUrl && (
          <p className="mt-2 text-center text-xs text-slate-500">
            Secure payment is temporarily unavailable. We will contact you after reviewing your request.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-xl border border-surface-muted bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Dental Practice name" name="business_name" required />
        <Field label="Your name" name="claimant_name" required />
        <Field label="Business email" name="business_email" type="email" required />
        <Field label="Business phone" name="business_phone" type="tel" required />
        <Field label="Business website" name="business_website" type="url" required />
        <Field label="City and state or province" name="location" required />
      </div>

      <div className="mt-5">
        <label htmlFor="request_type" className="block text-sm font-medium text-navy">
          What do you need? <span aria-hidden="true">*</span>
        </label>
        <select
          id="request_type"
          name="request_type"
          required
          defaultValue=""
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="" disabled>Select one</option>
          <option value="Verify an existing listing">Verify an existing listing</option>
          <option value="Correct an existing listing">Correct an existing listing</option>
          <option value="Add a new listing">Add a new listing</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="listing_url" className="block text-sm font-medium text-navy">
          Directory listing or city-page address
        </label>
        <input
          id="listing_url"
          name="listing_url"
          type="url"
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          placeholder="https://dentistrydirectories.com/state/city"
        />
        <p className="mt-1 text-xs text-slate-500">
          Leave this blank only if your dental practice is not currently listed.
        </p>
      </div>

      <div className="mt-5">
        <label htmlFor="requested_changes" className="block text-sm font-medium text-navy">
          Information to confirm or correct <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="requested_changes"
          name="requested_changes"
          rows={5}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          placeholder="Tell us what is correct and list any requested changes to the business name, address, phone number, or website."
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="authorized"
          value="Yes"
          required
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal"
        />
        <span>
          I confirm that I own this dental dental practice or am authorized to request changes
          on its behalf. <span aria-hidden="true">*</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit Verification Request"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          The form could not be sent. Please try again or email
          hello@directoriesnetwork.com.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-navy">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
  );
}
