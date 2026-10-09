import type { Facility } from "@/components/FacilityCard";
import fs from "fs";
import path from "path";
import { getCanadaStatsForGlobal } from "@/lib/canadaFacilities";

export type RawFacility = {
  id: string;
  name: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  addressLine1: string;
  addressLine2?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  mapsUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  careTypes?: string[];
  featured?: boolean;
  premium?: boolean;
  claimed?: boolean;
  recommended?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

type AlternateFormatFacilityRaw = {
  name: string;
  care_type?: string;
  type?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  place_id?: string | null;
  recommended?: boolean;
  featured?: boolean;
  premium?: boolean;
  claimed?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

function slugify(text: string | null | undefined): string {
  return (text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function transformAlternateFormatFacilities(
  facilities: AlternateFormatFacilityRaw[],
  stateName: string,
  stateSlug: string,
): RawFacility[] {
  const valid = facilities.filter((f) => ((f.city ?? "").trim() !== ""));
  return valid.map((f, index) => {
    const citySlug = slugify(f.city);
    const nameSlug = slugify(f.name);
    const id = `${nameSlug}-${citySlug}-${index}`;
    const addressParts = ((f.address ?? "").trim() || "")
      .split(",")
      .map((s) => s.trim());
    const addressLine1 = addressParts[0] ?? "";
    const addressLine2 =
      addressParts.length > 1 ? addressParts.slice(1).join(", ") : undefined;
    const fullAddress = (f.address ?? "").trim();
    const mapsUrl = f.place_id
      ? `https://search.google.com/local/reviews?placeid=${f.place_id}&q=*&authuser=0&hl=en&gl=US`
      : fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
        : undefined;
    return {
      id,
      name: (f.name ?? "").trim() || "Unnamed",
      state: stateName,
      stateSlug,
      city: (f.city ?? "").trim() || "",
      citySlug,
      addressLine1,
      addressLine2: addressLine2 || null,
      phone: f.phone ?? null,
      websiteUrl: f.website ?? null,
      mapsUrl: mapsUrl ?? null,
      rating: f.rating ?? null,
      reviewCount: f.reviews ?? null,
      careTypes: (f.care_type ?? f.type) ? [f.care_type ?? f.type ?? ""] : [],
      featured: f.featured ?? undefined,
      premium: f.premium ?? undefined,
      claimed: f.claimed ?? undefined,
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

export type FacilityRecord = Facility & {
  id: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  reviewCount?: number | null;
};

export type CitySummary = {
  citySlug: string;
  cityName: string;
  facilityCount: number;
  averageRating: number | null;
};

export type StateSummary = {
  stateSlug: string;
  stateName: string;
  facilities: FacilityRecord[];
  totalFacilities: number;
  cities: CitySummary[];
  averageRating: number | null;
  careTypes: string[];
};

const CANADIAN_REGION_SLUGS = new Set([
  "alberta",
  "british-columbia",
  "manitoba",
  "new-brunswick",
  "newfoundland-and-labrador",
  "nova-scotia",
  "ontario",
  "prince-edward-island",
  "quebec",
  "saskatchewan",
  "northwest-territories",
  "nunavut",
  "yukon",
]);

/**
 * US state slugs from `data/{slug}_facilities.json`, excluding Canadian province files.
 * readdir errors yield [] (no hardcoded empty state lists).
 */
function discoverUsStateFacilitySlugs(): string[] {
  const dataDir = path.join(process.cwd(), "data");
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(dataDir);
  } catch {
    return [];
  }
  const suffix = "_facilities.json";
  return entries
    .filter((name) => name.endsWith(suffix))
    .map((name) => name.slice(0, -suffix.length))
    .filter((slug) => slug.length > 0 && !CANADIAN_REGION_SLUGS.has(slug))
    .sort((a, b) => a.localeCompare(b));
}

const US_STATE_SLUGS: readonly string[] = discoverUsStateFacilitySlugs();

function fallbackStateNameFromSlug(stateSlug: string): string {
  return stateSlug
    .split("-")
    .map((part) => {
      if (!part) return part;
      if (part.toLowerCase() === "dc") return "DC";
      return part[0]?.toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function normalizeStateFacilitiesJson(
  parsed: unknown,
  stateSlug: string,
):
  | { stateName: string; facilities: AlternateFormatFacilityRaw[] }
  | null {
  if (Array.isArray(parsed)) {
    const facilitiesAll = parsed as AlternateFormatFacilityRaw[];
    const facilities = facilitiesAll.filter(
      (f) => (f.country ?? "").toLowerCase() !== "canada",
    );
    if (facilities.length === 0) return null;
    const stateName =
      (facilities[0]?.state ?? "").trim() ||
      fallbackStateNameFromSlug(stateSlug);
    return { stateName, facilities };
  }

  if (parsed && typeof parsed === "object") {
    const obj = parsed as {
      facilities?: unknown;
      state?: unknown;
    };

    const facilitiesAll = Array.isArray(obj.facilities)
      ? (obj.facilities as AlternateFormatFacilityRaw[])
      : [];
    const facilities = facilitiesAll.filter(
      (f) => (f.country ?? "").toLowerCase() !== "canada",
    );
    if (facilities.length === 0) return null;

    const stateFromObject =
      typeof obj.state === "string" ? obj.state.trim() : undefined;

    const stateName =
      stateFromObject ||
      (facilities[0]?.state ?? "").trim() ||
      fallbackStateNameFromSlug(stateSlug);

    return { stateName, facilities };
  }

  return null;
}

/**
 * Each US state file is loaded with `fs.readFileSync` inside try/catch.
 * Any failure (missing file, invalid JSON, empty normalized payload) returns `[]`.
 * Never assign a hardcoded empty array for a state in source — only the catch/fallback paths.
 */
function loadUsStateFacilities(stateSlug: string): RawFacility[] {
  const filePath = path.join(
    process.cwd(),
    "data",
    `${stateSlug}_facilities.json`,
  );
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed: unknown = JSON.parse(content);
    const normalized = normalizeStateFacilitiesJson(parsed, stateSlug);
    if (!normalized) return [];
    return transformAlternateFormatFacilities(
      normalized.facilities,
      normalized.stateName,
      stateSlug,
    );
  } catch {
    return [];
  }
}

/**
 * Batch-load every discovered US `*_facilities.json` at module init (single pass).
 * Each state uses `loadUsStateFacilities` → `fs.readFileSync` + try/catch → `[]` on failure.
 */
const STATE_DATA: Record<string, RawFacility[]> = {};
for (const slug of US_STATE_SLUGS) {
  STATE_DATA[slug] = loadUsStateFacilities(slug);
}

async function loadFacilitiesForState(
  stateSlug: string,
): Promise<RawFacility[]> {
  const normalized = (stateSlug ?? "").toLowerCase();
  return STATE_DATA[normalized] ?? [];
}

function toFacilityRecord(raw: RawFacility): FacilityRecord {
  const addressLines: string[] = [raw.addressLine1];
  if (raw.addressLine2) {
    addressLines.push(raw.addressLine2);
  }

  return {
    id: raw.id,
    name: raw.name,
    addressLines,
    phone: raw.phone ?? "Phone not listed",
    websiteUrl: raw.websiteUrl ?? undefined,
    mapsUrl: raw.mapsUrl ?? undefined,
    rating:
      typeof raw.rating === "number" && !Number.isNaN(raw.rating)
        ? raw.rating
        : undefined,
    careTypes: raw.careTypes ?? [],
    state: raw.state,
    stateSlug: raw.stateSlug,
    city: raw.city,
    citySlug: raw.citySlug,
    reviewCount: raw.reviewCount ?? undefined,
    featured: raw.featured ?? undefined,
    premium: raw.premium ?? undefined,
    recommended: raw.recommended ?? undefined,
    logo: raw.logo ?? undefined,
    tagline: raw.tagline ?? undefined,
  };
}

export async function getStateSummary(
  stateSlug: string,
): Promise<StateSummary> {
  const safeSlug = stateSlug ?? "";
  const rawFacilities = await loadFacilitiesForState(safeSlug);
  const facilities = rawFacilities.map(toFacilityRecord);

  const totalFacilities = facilities.length;

  const cityMap = new Map<
    string,
    {
      citySlug: string;
      cityName: string;
      facilityCount: number;
      ratingSum: number;
      ratingCount: number;
    }
  >();
  for (const facility of facilities) {
    const key = (facility.citySlug ?? "").toLowerCase();
    const existing = cityMap.get(key);
    const ratingValue =
      typeof facility.rating === "number" && facility.rating > 0
        ? facility.rating
        : null;

    if (existing) {
      existing.facilityCount += 1;
      if (ratingValue !== null) {
        existing.ratingSum += ratingValue;
        existing.ratingCount += 1;
      }
    } else {
      cityMap.set(key, {
        citySlug: facility.citySlug,
        cityName: facility.city,
        facilityCount: 1,
        ratingSum: ratingValue ?? 0,
        ratingCount: ratingValue !== null ? 1 : 0,
      });
    }
  }

  const cities: CitySummary[] = Array.from(cityMap.values())
    .map((city) => ({
      citySlug: city.citySlug,
      cityName: city.cityName,
      facilityCount: city.facilityCount,
      averageRating:
        city.ratingCount > 0
          ? Number((city.ratingSum / city.ratingCount).toFixed(1))
          : null,
    }))
    .sort((a, b) => a.cityName.localeCompare(b.cityName));

  const ratings = facilities
    .map((facility) => facility.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" && rating > 0 && !Number.isNaN(rating),
    );

  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length)
            .toFixed(1),
        )
      : null;

  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((facility) => facility.careTypes ?? [])
        .map((type) => type.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const normalizedSlug = safeSlug.toLowerCase();
  const stateNameFromData = facilities[0]?.state;
  const fallbackName =
    normalizedSlug.length > 0
      ? fallbackStateNameFromSlug(normalizedSlug)
      : normalizedSlug;

  const stateName = stateNameFromData ?? fallbackName;

  return {
    stateSlug: normalizedSlug,
    stateName,
    facilities,
    totalFacilities,
    cities,
    averageRating,
    careTypes,
  };
}

export async function getCityFacilities(
  stateSlug: string,
  citySlug: string,
): Promise<{
  stateName: string;
  cityName: string;
  facilities: FacilityRecord[];
  totalFacilities: number;
  citiesCount: number;
}> {
  const safeState = stateSlug ?? "";
  const safeCity = citySlug ?? "";
  const stateSummary = await getStateSummary(safeState);
  const normalizedCity = safeCity.toLowerCase();

  const facilities = stateSummary.facilities.filter(
    (facility) => facility.citySlug.toLowerCase() === normalizedCity,
  );

  const cityNameFromData = facilities[0]?.city;
  const fallbackCityName =
    normalizedCity.length > 0
      ? normalizedCity[0]?.toUpperCase() + normalizedCity.slice(1)
      : normalizedCity;

  const cityName = cityNameFromData ?? fallbackCityName;

  return {
    stateName: stateSummary.stateName,
    cityName,
    facilities,
    totalFacilities: stateSummary.totalFacilities,
    citiesCount: stateSummary.cities.length,
  };
}

export async function getOtherCitiesInState(
  stateSlug: string,
  citySlug: string,
  limit = 6,
): Promise<CitySummary[]> {
  const summary = await getStateSummary(stateSlug);
  const cities = summary.cities;
  const targetSlug = (citySlug ?? "").toLowerCase();
  const currentIndex = cities.findIndex(
    (city) => city.citySlug.toLowerCase() === targetSlug,
  );

  const filtered = cities.filter(
    (city) => city.citySlug.toLowerCase() !== targetSlug,
  );
  if (currentIndex === -1) {
    return filtered.slice(0, limit);
  }

  const result: CitySummary[] = [];
  let left = currentIndex - 1;
  let right = currentIndex + 1;
  while (result.length < limit && (left >= 0 || right < cities.length)) {
    if (left >= 0) {
      const leftCity = cities[left];
      if (leftCity.citySlug.toLowerCase() !== targetSlug) {
        result.push(leftCity);
      }
      left -= 1;
    }
    if (result.length >= limit) break;
    if (right < cities.length) {
      const rightCity = cities[right];
      if (rightCity.citySlug.toLowerCase() !== targetSlug) {
        result.push(rightCity);
      }
      right += 1;
    }
  }

  return result.slice(0, limit);
}

export async function getDirectoryIndex(): Promise<
  {
    stateSlug: string;
    stateName: string;
    totalFacilities: number;
    cities: CitySummary[];
  }[]
> {
  const stateSlugs = [...US_STATE_SLUGS].sort();
  const summaries = await Promise.all(
    stateSlugs.map((slug) => getStateSummary(slug)),
  );
  return summaries
    .map((summary) => ({
      stateSlug: summary.stateSlug,
      stateName: summary.stateName,
      totalFacilities: summary.totalFacilities,
      cities: summary.cities,
    }))
    .sort((a, b) =>
      a.stateName.localeCompare(b.stateName, "en", { sensitivity: "base" }),
    );
}

export type GlobalStats = {
  totalFacilities: number;
  totalCities: number;
  averageRating: number | null;
};

export function getGlobalStats(): GlobalStats {
  let totalFacilities = 0;
  const usCityKeys = new Set<string>();
  const ratings: number[] = [];

  // US totals from STATE_DATA; Canada added via getCanadaStatsForGlobal() when province JSON exists.
  for (const slug of US_STATE_SLUGS) {
    const facilities = STATE_DATA[slug] ?? [];
    totalFacilities += facilities.length;
    for (const f of facilities) {
      usCityKeys.add(`${f.stateSlug}:${f.citySlug}`);
      if (
        typeof f.rating === "number" &&
        !Number.isNaN(f.rating) &&
        f.rating > 0
      ) {
        ratings.push(f.rating);
      }
    }
  }

  const ca = getCanadaStatsForGlobal();
  totalFacilities += ca.totalFacilities;
  const totalCities = usCityKeys.size + ca.totalCities;
  ratings.push(...ca.ratings);

  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : null;

  return {
    totalFacilities,
    totalCities,
    averageRating,
  };
}

export function getStateResourcesUrl(stateSlug: string): string {
  return "https://www.usa.gov/consumer-protection";
  const normalized = stateSlug.toLowerCase();
  if (normalized === "california") {
    return "https://aging.ca.gov/";
  }
  if (normalized === "florida") {
    return "https://elderaffairs.org/";
  }
  if (normalized === "texas") {
    return "https://www.hhs.texas.gov/";
  }
  if (normalized === "new-york") {
    return "https://aging.ny.gov/";
  }
  if (normalized === "arizona") {
    return "https://des.az.gov/aging-adult-services";
  }
  if (normalized === "illinois") {
    return "https://aging.illinois.gov/";
  }
  if (normalized === "michigan") {
    return "https://www.usa.gov/consumer-protection";
  }
  if (normalized === "ohio") {
    return "https://aging.ohio.gov/";
  }
  if (normalized === "south-carolina") {
    return "https://aging.sc.gov/";
  }
  if (normalized === "maryland") {
    return "https://aging.maryland.gov/";
  }
  if (normalized === "new-mexico") {
    return "https://aging.nm.gov/";
  }
  if (normalized === "kansas") {
    return "https://aging.kdads.ks.gov/";
  }
  if (normalized === "hawaii") {
    return "https://health.hawaii.gov/aging/";
  }
  if (normalized === "wisconsin") {
    return "https://www.dhs.wisconsin.gov/aging/";
  }
  if (normalized === "missouri") {
    return "https://www.usa.gov/consumer-protection";
  }
  if (normalized === "indiana") {
    return "https://www.in.gov/fssa/da/3479.htm";
  }
  if (normalized === "north-carolina") {
    return "https://www.ncdhhs.gov/divisions/aging-and-adult-services";
  }
  if (normalized === "utah") {
    return "https://aging.utah.gov/";
  }
  if (normalized === "virginia") {
    return "https://www.dss.virginia.gov/";
  }
  if (normalized === "nebraska") {
    return "https://dhhs.ne.gov/Pages/aging.aspx";
  }
  if (normalized === "arkansas") {
    return "https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-and-behavioral-health-services";
  }
  if (normalized === "tennessee") {
    return "https://www.tn.gov/aging.html";
  }
  if (normalized === "kentucky") {
    return "https://chfs.ky.gov/agencies/dail/Pages/default.aspx";
  }
  if (normalized === "minnesota") {
    return "https://www.usa.gov/consumer-protection";
  }
  if (normalized === "idaho") {
    return "https://aging.idaho.gov/";
  }
  if (normalized === "new-jersey") {
    return "https://www.usa.gov/consumer-protection";
  }
  if (normalized === "new-hampshire") {
    return "https://www.dhhs.nh.gov/programs/elderly-adult-services";
  }
  if (normalized === "connecticut") {
    return "https://portal.ct.gov/aging";
  }
  if (normalized === "colorado") {
    return "https://aging.colorado.gov/";
  }
  if (normalized === "georgia") {
    return "https://dhs.georgia.gov/division-aging-services";
  }
  if (normalized === "nevada") {
    return "https://aging.nv.gov/";
  }
  if (normalized === "alabama") {
    return "https://alabamaageline.gov/";
  }
  if (normalized === "louisiana") {
    return "https://ldaf.state.la.us/aging-adult-services/";
  }
  if (normalized === "oregon") {
    return "https://www.usa.gov/consumer-protection";
  }
  if (normalized === "washington") {
    return "https://www.dshs.wa.gov/aging-and-long-term-support-administration";
  }
  if (normalized === "massachusetts") {
    return "https://www.mass.gov/orgs/executive-office-of-elder-affairs";
  }
  if (normalized === "vermont") {
    return "https://www.vermont.gov/agency/das";
  }
  return "https://www.usa.gov/consumer-protection";
}

export function getHreflangForRegionSlug(
  regionSlug: string,
): "en-us" | "en-ca" {
  const normalized = (regionSlug ?? "").toLowerCase();
  return CANADIAN_REGION_SLUGS.has(normalized) ? "en-ca" : "en-us";
}
