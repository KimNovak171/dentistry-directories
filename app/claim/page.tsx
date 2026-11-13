import type { Metadata } from "next";
import Link from "next/link";
import { ClaimForm } from "./ClaimForm";

// Site-specific Stripe payment link for the one-time $19 add or edit listing service.
const CLAIM_PAYMENT_URL = "https://buy.stripe.com/5kQ4gzfiG8HJ4JU06ZfAc13";

export const metadata: Metadata = {
  title: { absolute: "Add or Edit Your Dental Practice Listing | DentistryDirectories.com" },
  description:
    "Add your dental practice to DentistryDirectories.com or update the details on your existing listing for a one-time $19 fee.",
  alternates: { canonical: "/claim" },
  openGraph: {
    title: "Add or Edit Your Dental Practice Listing | DentistryDirectories.com",
    description:
      "Add your dental practice to DentistryDirectories.com or update the details on your existing listing for a one-time $19 fee.",
    url: "/claim",
    siteName: "DentistryDirectories.com",
    type: "website",
  },
};

const includes = [
  "A new listing for your dental practice, or",
  "Changes to your business name, address, phone number or website link",
  "One-time payment with no subscription or renewal",
];

const steps = [
  "Find your listing, or the city page where it should appear.",
  "Tell us what to add or change.",
  "Complete the $19 payment. Your change goes into the next scheduled directory update.",
];

export default function ClaimPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          For Dental Practice Owners
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Add or Edit Your Listing
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Add your dental practice to the directory, or update the details on your
          existing listing.
        </p>
      </header>

      <section className="mt-10 max-w-3xl">
        <article className="rounded-xl border border-surface-muted bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            One-time listing service
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
            <h2 className="text-2xl font-semibold text-navy">
              Add or Edit a Listing
            </h2>
            <p className="text-xl font-semibold text-teal">$19 one time</p>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            There is no monthly charge. The $19 fee covers adding a new listing
            or updating an existing one in a scheduled directory update.
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            {includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-semibold text-teal" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a
            href="#listing-request"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Add or Edit My Listing — $19
          </a>
          <p className="mt-2 text-center text-xs text-slate-500">
            Submit your listing information before continuing to secure payment.
            Removals are free: just{" "}
            <Link href="/contact" className="font-medium text-teal hover:text-teal-soft">
              write to us
            </Link>
            .
          </p>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">How It Works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((text, index) => (
            <article
              key={text}
              className="rounded-xl border border-surface-muted border-l-4 border-l-teal bg-surface p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-teal">Step {index + 1}</p>
              <p className="mt-2 text-base font-medium text-navy">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="listing-request" className="mt-10 max-w-3xl scroll-mt-24">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Listing Request
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-navy">
            Tell Us What to Add or Change
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Submit the information below first. You will then continue to the
            one-time $19 payment.
          </p>
        </div>
        <ClaimForm paymentUrl={CLAIM_PAYMENT_URL} />
      </section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="font-medium text-teal hover:text-teal-soft">
          Back to homepage
        </Link>
        <Link href="/advertise" className="font-medium text-teal hover:text-teal-soft">
          Compare Featured and Premium listings
        </Link>
      </div>
    </main>
  );
}
