import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getCityFacilities,
  getDirectoryIndex,
  getHreflangForRegionSlug,
  getOtherCitiesInState,
} from "@/lib/stateFacilities";

const siteUrl = "https://familydoctordirectories.com";

type CityPageProps = {
  params: Promise<{ stateSlug: string; citySlug: string }>;
};

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { stateSlug, citySlug } = await params;
  const safeState = stateSlug ?? "";
  const safeCity = citySlug ?? "";
  const locale = getHreflangForRegionSlug(safeState);
  const canonicalPath = `/${safeState.toLowerCase()}/${safeCity.toLowerCase()}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const { stateName, cityName, facilities: cityFacilities } =
    await getCityFacilities(safeState, safeCity);
  const count = Array.isArray(cityFacilities) ? cityFacilities.length : 0;
  const title = `Family Doctor Practices in ${cityName}, ${stateName} | Family Doctor Directories`;
  const description = `Find ${count.toLocaleString()} family-doctor practices in ${cityName}, ${stateName}. Compare services and practice details. Verified listings with ratings and reviews.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        [locale]: canonicalUrl,
      },
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
          alt: `${cityName}, ${stateName} family-doctor practice directory preview`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const directory = await getDirectoryIndex();
  const params = directory.flatMap((state) =>
    state.cities.map((city) => ({
      stateSlug: state.stateSlug,
      citySlug: city.citySlug,
    })),
  );
  return params.filter(({ stateSlug, citySlug }) => stateSlug && citySlug);
}

export default async function CityPage({ params }: CityPageProps) {
  const { stateSlug, citySlug } = await params;
  const {
    stateName,
    cityName,
    facilities: facilitiesRaw,
    totalFacilities,
    citiesCount,
  } = await getCityFacilities(stateSlug ?? "", citySlug ?? "");
  const facilities = [...facilitiesRaw].sort((a, b) => {
    const score = (f: { featured?: boolean; premium?: boolean }) =>
      f.premium === true ? 2 : f.featured === true ? 1 : 0;
    return score(b) - score(a);
  });
  const otherCities = await getOtherCitiesInState(
    stateSlug ?? "",
    citySlug ?? "",
    6,
  );

  const stateSlugNorm = (stateSlug ?? "").toLowerCase();
  const citySlugNorm = (citySlug ?? "").toLowerCase();
  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((facility) => facility.careTypes ?? [])
        .map((type) => type.trim())
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
        name: stateName,
        item: `${siteUrl}/${stateSlugNorm}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: `${siteUrl}/${stateSlugNorm}/${citySlugNorm}`,
      },
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Family Doctor Practices in ${cityName}, ${stateName}`,
    url: `${siteUrl}/${stateSlugNorm}/${citySlugNorm}`,
    isPartOf: {
      "@type": "WebSite",
      name: "FamilyDoctorDirectories.com",
      url: `${siteUrl}/`,
    },
    about: [
      {
        "@type": "Thing",
        name: `${cityName} family-doctor practices`,
      },
      {
        "@type": "Thing",
        name: `${stateName} family-doctor services`,
      },
      {
        "@type": "Thing",
        name: "Family medicine",
      },
      {
        "@type": "Thing",
        name: "Primary care",
      },
      {
        "@type": "Thing",
        name: "General practice",
      },
      {
        "@type": "Thing",
        name: "Preventive care",
      },
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
          Family Doctor Practices in {cityName}, {stateName}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          {cityName} has {facilities.length.toLocaleString()} verified
          family-doctor practices including {careTypesText}. Browse all options
          below, each with Google Maps profile links and ratings data where
          available.
        </p>
        <p className="max-w-2xl text-sm text-slate-600">
          Compare practices side by side, review services and contact
          details, and share this page with fellow caregivers as you plan next
          steps in {stateName}.
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
            <Link
              href={`/${stateSlugNorm}`}
              className="text-teal hover:text-teal-soft"
            >
              {stateName}
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
            We don&apos;t have practices listed for {cityName}, {stateName} yet.
            As new data becomes available, practices will appear here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
              />
            ))}
          </div>
        )}
      </section>

      {otherCities.length > 0 && (
        <section className="mt-10 space-y-3 border-t border-surface-muted pt-6">
          <h2 className="text-base font-semibold text-navy">
            Other cities in {stateName}
          </h2>
          <p className="text-sm text-slate-600">
            Continue exploring nearby city directories within {stateName}.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {otherCities.map((city) => (
              <Link
                key={city.citySlug}
                href={`/${stateSlugNorm}/${city.citySlug}`}
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

