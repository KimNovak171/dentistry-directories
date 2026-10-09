export type Facility = {
  id?: string;
  name: string;
  addressLines: string[];
  phone: string;
  websiteUrl?: string;
  mapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  careTypes?: string[];
  state?: string;
  city?: string;
  featured?: boolean;
  premium?: boolean;
  claimed?: boolean;
  recommended?: boolean;
  logo?: string;
  tagline?: string;
};

type FacilityCardProps = {
  facility: Facility;
};

/** Single badge color for all care-type labels (dental directory). */
const CARE_TYPE_BADGE_COLOR = "#1d4ed8";

function truncateToWords(text: string, maxWords: number): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(" ") + "…";
}

/** Strip leading +1 or +1 space so phone displays as 213-385-1715 */
function normalizePhoneDisplay(phone: string): string {
  const s = (phone ?? "").trim();
  if (!s) return "Phone not listed";
  const withoutPlus1 = s.replace(/^\s*\+1\s*/i, "").trim();
  return withoutPlus1 || "Phone not listed";
}

/**
 * Google reviews URLs require a place_id. When it is missing (e.g. Canadian listings),
 * use the same address-based Maps search URL as the footer link.
 */
function resolveGoogleMapsHref(
  mapsUrl: string | undefined,
  addressLines: string[],
): string | undefined {
  const addressQuery = addressLines
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  const addressSearchUrl = addressQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`
    : undefined;

  if (!mapsUrl?.trim()) {
    return addressSearchUrl;
  }

  const trimmed = mapsUrl.trim();
  try {
    const u = new URL(trimmed);
    const isLocalReviews =
      u.hostname === "search.google.com" && u.pathname.includes("/local/reviews");
    if (isLocalReviews) {
      const pid = (u.searchParams.get("placeid") || "").trim();
      if (pid) return trimmed;
      return addressSearchUrl;
    }
    return trimmed;
  } catch {
    return trimmed || addressSearchUrl;
  }
}

const renderRating = (
  rating?: number,
  reviewCount?: number,
  mapsUrl?: string,
) => {
  if (!rating || rating <= 0) return null;

  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  const starsText = `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
  const ratingText = `${Number(rating).toFixed(1)}★${
    typeof reviewCount === "number" && reviewCount > 0
      ? ` • ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
      : ""
  }`;
  const content = (
    <>
      <span>{starsText}</span>
      <span className="ml-1 text-[15px]">{ratingText}</span>
    </>
  );

  if (!mapsUrl) {
    return (
      <div
        className="flex items-center gap-1 text-sm font-semibold text-gold"
        aria-label={`${Number(rating).toFixed(1)} out of 5 stars`}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm font-semibold text-gold underline underline-offset-2 hover:text-gold-soft"
      aria-label={`View ${Number(rating).toFixed(1)} star rating and reviews on Google Maps`}
    >
      {content}
    </a>
  );
};

export function FacilityCard({ facility }: FacilityCardProps) {
  const {
    id,
    name,
    addressLines,
    phone,
    websiteUrl,
    mapsUrl,
    rating,
    reviewCount,
    careTypes,
    state,
    city,
    featured,
    premium,
    claimed,
    recommended,
    logo,
    tagline,
  } = facility;
  const phoneDisplay = normalizePhoneDisplay(phone ?? "");
  const isFeatured = featured === true;
  const isRecommended = recommended === true;
  const showReviewCarefully = recommended === false;
  const isPremium = premium === true;
  const isClaimed = claimed === true;
  const taglineDisplay =
    isPremium && tagline && tagline.trim()
      ? truncateToWords(tagline.trim(), 60)
      : "";
  const hasLogo = isPremium && logo && logo.trim().length > 0;
  const claimParams = new URLSearchParams({ business: name });
  const claimLocation = [city, state].filter(Boolean).join(", ");
  if (claimLocation) claimParams.set("location", claimLocation);
  const claimHref = `/claim?${claimParams.toString()}#listing-request`;

  const mapsHref = resolveGoogleMapsHref(mapsUrl, addressLines);

  const aggregateRatingLd =
    typeof rating === "number" &&
    Number.isFinite(rating) &&
    rating > 0 &&
    typeof reviewCount === "number" &&
    Number.isFinite(reviewCount) &&
    reviewCount > 0
      ? {
          "@type": "AggregateRating" as const,
          ratingValue: rating,
          bestRating: 5,
          worstRating: 0,
          ratingCount: reviewCount,
          reviewCount: reviewCount,
        }
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    telephone: normalizePhoneDisplay(phone ?? ""),
    ...(websiteUrl && { url: websiteUrl }),
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLines[0],
      ...(city && { addressLocality: city }),
      ...(state && { addressRegion: state }),
    },
    ...(aggregateRatingLd && { aggregateRating: aggregateRatingLd }),
    ...(id && { identifier: id }),
  };

  return (
    <article
      className={`relative flex flex-col gap-3 rounded-xl border border-surface-muted border-l-[4px] border-t border-t-teal bg-surface-muted px-4 py-4 shadow-sm ${isFeatured ? "border-l-teal" : "border-l-navy"}`}
    >
      {isPremium && (
        <span
          className="absolute right-4 top-4 rounded-full border border-teal bg-white px-2.5 py-0.5 text-xs font-semibold text-teal"
          aria-label="Premium listing"
        >
          Premium
        </span>
      )}
      {isFeatured && !isPremium && (
        <span
          className="absolute right-4 top-4 rounded-full bg-teal px-2.5 py-0.5 text-xs font-semibold text-white"
          aria-label="Featured listing"
        >
          ⭐ Featured
        </span>
      )}
      {isClaimed && !isFeatured && !isPremium && (
        <span className="absolute right-4 top-4 rounded-full border border-teal bg-white px-2.5 py-0.5 text-xs font-semibold text-teal" aria-label="Verified listing">
          Verified
        </span>
      )}      {hasLogo && (
        <div className="flex justify-start">
          <img
            src={logo!.trim()}
            alt=""
            className="h-14 w-auto max-w-[180px] object-contain object-left"
          />
        </div>
      )}
      <div className={`flex flex-wrap items-start justify-between gap-2 ${isPremium ? "pr-16" : isFeatured ? "pr-20" : isClaimed ? "pr-20" : ""}`}>
        <h3 className="text-xl font-semibold leading-snug text-navy">
          {name}
        </h3>
        {renderRating(rating, reviewCount, mapsHref)}
      </div>
      {(isRecommended || showReviewCarefully) && (
        <p className="text-xs font-medium">
          {isRecommended ? (
            <span className="inline-flex rounded-full bg-[#2E7D32] px-2.5 py-0.5 text-white">
              Recommended
            </span>
          ) : showReviewCarefully ? (
            <span className="inline-flex rounded-full bg-amber-600 px-2.5 py-0.5 text-white">
              Review carefully
            </span>
          ) : null}
        </p>
      )}
      {taglineDisplay && (
        <p className="border-l-2 border-teal bg-teal/5 px-3 py-2 text-[15px] leading-snug text-slate-700">
          {taglineDisplay}
        </p>
      )}

      {careTypes && careTypes.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {careTypes.map((type) => {
            return (
              <span
                key={type}
                className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: CARE_TYPE_BADGE_COLOR }}
              >
                {type}
              </span>
            );
          })}
        </div>
      )}

      <div className="space-y-1 text-[15px] text-slate-700">
        {addressLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[15px]">
        <p className="font-semibold text-teal">{phoneDisplay}</p>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            Visit website
          </a>
        )}
        {mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            🗺 View on Google Maps →
          </a>
        )}
      </div>

      {!isClaimed && (
        <div className="mt-auto border-t border-slate-200 pt-3">
          <a
            href={claimHref}
            className="inline-flex w-full items-center justify-center rounded-full border border-teal bg-white px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            aria-label={`Verify the listing for ${name} for a one-time $19 fee`}
          >
            Own this dental practice? Verify listing — $19
          </a>
          <p className="mt-1.5 text-center text-xs text-slate-500">
            One-time fee. No subscription or renewal.
          </p>
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}

