import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getCanadaCityFacilities,
  getCanadaDirectoryIndex,
  getOtherCitiesInProvince,
} from "@/lib/canadaFacilities";

const siteUrl = "https://familydoctordirectories.com";

type CanadaCityPageProps = {
  params: Promise<{ provinceSlug: string; citySlug: string }>;
};

export async function generateMetadata({
  params,
}: CanadaCityPageProps): Promise<Metadata> {
  const { provinceSlug, citySlug } = await params;
  const safeProvince = provinceSlug ?? "";
  const safeCity = citySlug ?? "";
  const canonicalPath = `/canada/${safeProvince.toLowerCase()}/${safeCity.toLowerCase()}`;

  const { provinceName, cityName, facilities: cityFacilities } =
    await getCanadaCityFacilities(safeProvince, safeCity);
  const count = Array.isArray(cityFacilities) ? cityFacilities.length : 0;
  const title = `Family Doctor Practices in ${cityName}, ${provinceName}, Canada | Family Doctor Directories`;
  const description = `Find ${count.toLocaleString()} family-doctor practices in ${cityName}, ${provinceName}. Compare services and practice details. Verified listings with ratings and reviews.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "FamilyDoctorDirectories.com",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${cityName}, ${provinceName} family-doctor practice directory preview`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const directory = await getCanadaDirectoryIndex();
  return directory.flatMap((province) =>
    province.cities.map((city) => ({
      provinceSlug: province.provinceSlug,
      citySlug: city.citySlug,
    })),
  );
}

export default async function CanadaCityPage({ params }: CanadaCityPageProps) {
  const { provinceSlug, citySlug } = await params;
  const {
    provinceName,
    cityName,
    facilities: facilitiesRaw,
    totalFacilities,
    citiesCount,
  } = await getCanadaCityFacilities(provinceSlug ?? "", citySlug ?? "");
  const facilities = [...facilitiesRaw].sort((a, b) => {
    const score = (f: { featured?: boolean; premium?: boolean }) =>
      f.premium === true ? 2 : f.featured === true ? 1 : 0;
    return score(b) - score(a);
  });
  const otherCities = await getOtherCitiesInProvince(
    provinceSlug ?? "",
    citySlug ?? "",
    6,
  );

  const provinceSlugNorm = (provinceSlug ?? "").toLowerCase();
  const citySlugNorm = (citySlug ?? "").toLowerCase();
  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((f) => f.careTypes ?? [])
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );
  const careTypesText =
    careTypes.length > 0
      ? careTypes.slice(0, 4).join(", ")
      : "family-doctor services";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "FamilyDoctorDirectories.com",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Canada",
        item: `${siteUrl}/canada`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: provinceName,
        item: `${siteUrl}/canada/${provinceSlugNorm}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: cityName,
        item: `${siteUrl}/canada/${provinceSlugNorm}/${citySlugNorm}`,
      },
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Family Doctor Practices in ${cityName}, ${provinceName}, Canada`,
    url: `${siteUrl}/canada/${provinceSlugNorm}/${citySlugNorm}`,
    isPartOf: {
      "@type": "WebSite",
      name: "FamilyDoctorDirectories.com",
      url: `${siteUrl}/`,
    },
    about: [
      { "@type": "Thing", name: `${cityName} family-doctor practices` },
      { "@type": "Thing", name: `${provinceName} family-doctor services` },
      { "@type": "Thing", name: "Family medicine" },
      { "@type": "Thing", name: "Primary care" },
      { "@type": "Thing", name: "General practice" },
      { "@type": "Thing", name: "Preventive care" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "main p"],
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Family Doctor by city
        </p>
        <h1 className="text-3xl font-semibold text-navy">
          Family Doctor Practices in {cityName}, {provinceName}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          {cityName} has {facilities.length.toLocaleString()} verified
          family-doctor practices including {careTypesText}. Browse all options below,
          each with Google Maps profile links and ratings data where available.
        </p>
        <p className="max-w-2xl text-sm text-slate-600">
          Compare practices side by side, review services and contact
          details, and share this page with fellow caregivers as you plan next
          steps in {provinceName}.
        </p>
      </header>

      <nav
        aria-label="Breadcrumb"
        className="mt-3 text-xs font-medium text-slate-600"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="text-teal hover:text-teal-soft">
              Home
            </Link>
          </li>
          <li aria-hidden="true">→</li>
          <li>
            <Link href="/canada" className="text-teal hover:text-teal-soft">
              Canada
            </Link>
          </li>
          <li aria-hidden="true">→</li>
          <li>
            <Link
              href={`/canada/${provinceSlugNorm}`}
              className="text-teal hover:text-teal-soft"
            >
              {provinceName}
            </Link>
          </li>
          <li aria-hidden="true">→</li>
          <li className="text-slate-700">{cityName}</li>
        </ol>
      </nav>

      <section className="mt-8 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">
          Practices in {cityName}
        </h2>

        {facilities.length === 0 ? (
          <p className="text-sm text-slate-600">
            We don&apos;t have facilities listed for {cityName}, {provinceName}{" "}
            yet. As new data becomes available, practices will appear here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        )}
      </section>

      {otherCities.length > 0 && (
        <section className="mt-10 space-y-3 border-t border-surface-muted pt-6">
          <h2 className="text-base font-semibold text-navy">
            Other cities in {provinceName}
          </h2>
          <p className="text-sm text-slate-600">
            Continue exploring nearby city directories within {provinceName}.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {otherCities.map((city) => (
              <Link
                key={city.citySlug}
                href={`/canada/${provinceSlugNorm}/${city.citySlug}`}
                className="rounded-lg border border-surface-muted border-l-[3px] border-l-navy bg-surface px-3 py-2 text-sm text-navy shadow-sm transition hover:border-teal hover:bg-surface-muted hover:text-navy"
              >
                <p className="font-medium">{city.cityName}</p>
                <p className="text-xs text-slate-600">
                  {city.facilityCount.toLocaleString()}{" "}
                  {city.facilityCount === 1 ? "practice" : "practices"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
