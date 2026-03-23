import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import { getCanadaDirectoryIndex } from "@/lib/canadaFacilities";
import { getDirectoryIndex, getStateSummary, getGlobalStats } from "@/lib/stateFacilities";

export const metadata: Metadata = {
  title:
    "Family Doctor Directory USA & Canada | Verified family-doctors",
  description:
    "Browse verified family-doctors across the US and Canada. Find family doctors, general practitioners, and primary care physicians — all rated 3 stars or higher on Google Maps.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Family Doctor Directory USA & Canada | Verified family-doctors",
    description:
      "Browse verified family-doctors across the US and Canada. Find family doctors, general practitioners, and primary care physicians — all rated 3 stars or higher on Google Maps.",
    url: "/",
    siteName: "familydoctordirectories.com",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "familydoctordirectories.com homepage preview",
      },
    ],
  },
};

export default async function Home() {
  const [usDirectory, canadaDirectory] = await Promise.all([
    getDirectoryIndex(),
    getCanadaDirectoryIndex(),
  ]);
  const usStatesSorted = [...usDirectory].sort((a, b) =>
    a.stateName.localeCompare(b.stateName, "en", { sensitivity: "base" }),
  );
  const stateSummaries = await Promise.all(
    usDirectory.map((s) => getStateSummary(s.stateSlug)),
  );
  const globalStats = getGlobalStats();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "familydoctordirectories.com",
        item: "https://familydoctordirectories.com/",
      },
    ],
  };

  return (
    <div className="bg-surface text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="space-y-6 text-foreground">
            <p className="inline-flex rounded-full border border-teal bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground">
              Family Doctor Directories
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Find Trusted Family Doctors — State by State
            </h1>
            <p className="max-w-2xl text-balance text-sm sm:text-base text-foreground/80">
              Verified family-doctors and services across the US and
              Canada. Every practice rated 3★ or higher on Google Maps.
            </p>
          </div>

          <div className="w-full rounded-2xl border-2 border-teal/40 bg-surface p-6 shadow-xl shadow-navy/20 ring-1 ring-teal/30">
            <h2 className="text-xl font-semibold text-foreground">
              Start with a state directory
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              Browse verified family-doctors by state, then drill down by
              city to compare services and contact details.
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {usStatesSorted.map((s) => s.stateName).join(" • ")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {usStatesSorted.map((state) => (
                <Link
                  key={state.stateSlug}
                  href={`/${state.stateSlug}`}
                  className="rounded-xl border-2 border-gold bg-surface px-5 py-4 text-left text-navy transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <p className="text-lg font-semibold">{state.stateName}</p>
                  <p className="mt-1 text-sm text-gold-soft">
                    {state.stateName} — {state.totalFacilities.toLocaleString()} practices
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-foreground">
              Each state has its own dedicated directory — specific
              practices, specific cities, built for that state only.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-navy">
          Canadian Family Doctor Directories
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Browse verified family-doctors by Canadian province. Same
          directory experience — province by province, then by city.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {canadaDirectory.map((item) => (
            <Link
              key={item.provinceSlug}
              href={`/canada/${item.provinceSlug}`}
              className="rounded-xl border-2 border-gold bg-surface px-5 py-4 text-left text-navy transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <p className="text-lg font-semibold">{item.provinceName}</p>
              <p className="mt-1 text-sm text-gold-soft">
                {item.provinceName} — {item.totalFacilities.toLocaleString()} practices
              </p>
            </Link>
          ))}
        </div>
      </section>

      {(() => {
        const allFeatured = stateSummaries
          .flatMap((s) => s.facilities)
          .filter((f) => f.featured === true || f.premium === true)
          .slice(0, 6);
        if (allFeatured.length === 0) return null;
        return (
          <section className="mx-auto max-w-6xl rounded-2xl border-2 border-teal/20 bg-surface px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground">
              Featured family-doctors
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Selected practices across our directories — verified listings for
              families comparing family-doctor options.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allFeatured.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        );
      })()}

      <p className="mx-auto max-w-2xl rounded-lg border-2 border-teal/40 bg-surface px-4 py-3 text-center text-sm text-slate-700">
        Family Doctor practice owners: Get featured at the top of your city listing.{" "}
        <Link
          href="/advertise"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          Learn about featured practice placement
        </Link>{" "}
        or contact{" "}
        <a
          href="mailto:support@familydoctordirectories.com"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          support@familydoctordirectories.com
        </a>
        .
      </p>

      <section className="mt-8 border-y-2 border-teal/30 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Verified family-doctors
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {globalStats.totalFacilities.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Cities Covered
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {globalStats.totalCities.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Average Rating
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {globalStats.averageRating != null
                ? `${globalStats.averageRating}★`
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Quality Standard
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">3★ Minimum</p>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground border-b-2 border-teal/50 pb-2 inline-block">
            How It Works
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                1️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Choose your state
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Start with Florida or California to access complete state
                directories.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                2️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Browse by city
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Compare local options by city with ratings, family doctor care services,
                and contact details.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                3️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Contact family-doctors directly
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Use website and maps links to verify details and contact
                practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface border-y border-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground border-b-2 border-teal/50 pb-2 inline-block">
            Why Trust Us
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Google Verified Data
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                All practices sourced from Google Maps with real ratings and
                reviews.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Quality Filtered
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Minimum 3-star rating, irrelevant businesses removed.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Always Free to Browse
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                No signup required, no spam, just helpful information for
                families.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/50 bg-surface p-6 text-foreground ring-1 ring-gold/30">
            <h2 className="text-2xl font-semibold text-foreground">
              Are You a Family Doctor Practice Owner?
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-foreground/90">
              Get your practice seen by caregivers actively searching for family-doctor
              options in your city. Featured listings available.
            </p>
            <div className="mt-5">
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Learn About Featured Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

