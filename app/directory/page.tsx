import type { Metadata } from "next";
import Link from "next/link";
import { getCanadaDirectoryIndex } from "@/lib/canadaFacilities";
import { getDirectoryIndex } from "@/lib/stateFacilities";

export const metadata: Metadata = {
  title: "Full State, Province and City Directory",
  description:
    "Browse every U.S. state, Canadian province and city included in DentistryDirectories.com.",
  alternates: { canonical: "/directory" },
};

export default async function DirectoryPage() {
  const [directory, canadaDirectory] = await Promise.all([
    getDirectoryIndex(),
    getCanadaDirectoryIndex(),
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground">
          Full State, Province and City Directory
        </h1>
        <p className="max-w-3xl text-sm text-foreground/75">
          Browse every location covered by DentistryDirectories.com. Choose a
          state or province, then select a city to view its dental listings.
        </p>
      </header>

      <section className="space-y-6" aria-labelledby="us-directory-heading">
        <h2 id="us-directory-heading" className="text-2xl font-semibold text-foreground">
          United States
        </h2>
        {directory.map((state) => (
          <div key={state.stateSlug} className="space-y-2 border-b border-teal/10 pb-5">
            <Link
              href={`/${state.stateSlug}`}
              className="text-lg font-semibold text-teal hover:text-teal-soft"
            >
              {state.stateName}
            </Link>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {state.cities.map((city) => (
                <Link
                  key={`${state.stateSlug}-${city.citySlug}`}
                  href={`/${state.stateSlug}/${city.citySlug}`}
                  className="text-xs text-foreground/85 hover:text-teal"
                >
                  {city.cityName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {canadaDirectory.length > 0 && (
        <section className="space-y-6" aria-labelledby="canada-directory-heading">
          <h2 id="canada-directory-heading" className="text-2xl font-semibold text-foreground">
            Canada
          </h2>
          {canadaDirectory.map((province) => (
            <div key={province.provinceSlug} className="space-y-2 border-b border-teal/10 pb-5">
              <Link
                href={`/canada/${province.provinceSlug}`}
                className="text-lg font-semibold text-teal hover:text-teal-soft"
              >
                {province.provinceName}
              </Link>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {province.cities.map((city) => (
                  <Link
                    key={`${province.provinceSlug}-${city.citySlug}`}
                    href={`/canada/${province.provinceSlug}/${city.citySlug}`}
                    className="text-xs text-foreground/85 hover:text-teal"
                  >
                    {city.cityName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
