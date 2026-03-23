import type { Facility } from "@/components/FacilityCard";
import fs from "fs";
import path from "path";

/**
 * All provinces & territories that may have `data/{slug}_facilities.json`.
 * `discoverCanadaProvinceSlugsFromData()` finds which of these files exist and
 * loads each in one batch (`readFileSync` + try/catch → [] per file).
 * Maps links: when `place_id` is set, use `/maps/place/?q=place_id:{encoded_id}`;
 * otherwise `maps/search/?api=1&query={encoded_address}`.
 */
const ALL_CANADA_PROVINCE_SLUGS = [
  "alberta",
  "british-columbia",
  "manitoba",
  "new-brunswick",
  "newfoundland-and-labrador",
  "northwest-territories",
  "nova-scotia",
  "nunavut",
  "ontario",
  "prince-edward-island",
  "quebec",
  "saskatchewan",
  "yukon",
] as const;

const CANADA_SLUG_SET = new Set<string>(ALL_CANADA_PROVINCE_SLUGS);

function discoverCanadaProvinceSlugsFromData(): string[] {
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
    .filter((slug) => slug.length > 0 && CANADA_SLUG_SET.has(slug))
    .sort((a, b) => a.localeCompare(b));
}

const PROVINCE_DISPLAY_NAMES: Record<string, string> = {
  alberta: "Alberta",
  "british-columbia": "British Columbia",
  manitoba: "Manitoba",
  "new-brunswick": "New Brunswick",
  "newfoundland-and-labrador": "Newfoundland and Labrador",
  "northwest-territories": "Northwest Territories",
  "nova-scotia": "Nova Scotia",
  nunavut: "Nunavut",
  ontario: "Ontario",
  "prince-edward-island": "Prince Edward Island",
  quebec: "Quebec",
  saskatchewan: "Saskatchewan",
  yukon: "Yukon",
};

function loadCanadaProvinceRawArray(slug: string): CanadaFacilityRaw[] {
  const filePath = path.join(process.cwd(), "data", `${slug}_facilities.json`);
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (Array.isArray(parsed)) return parsed as CanadaFacilityRaw[];
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { facilities?: unknown }).facilities)
    ) {
      return (parsed as { facilities: CanadaFacilityRaw[] }).facilities;
    }
    return [];
  } catch {
    return [];
  }
}

type CanadaFacilityRaw = {
  name: string;
  care_type?: string;
  address: string;
  city: string;
  /** Some exports use `state` for the province name (e.g. Alberta). */
  province?: string;
  state?: string;
  country?: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  place_id?: string | null;
  recommended?: boolean;
  featured?: boolean;
  premium?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

export type CanadaRawFacility = {
  id: string;
  name: string;
  province: string;
  provinceSlug: string;
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
  recommended?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

export type CanadaFacilityRecord = Facility & {
  id: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  reviewCount?: number | null;
};

export type ProvinceCitySummary = {
  citySlug: string;
  cityName: string;
  facilityCount: number;
  averageRating: number | null;
};

export type ProvinceSummary = {
  provinceSlug: string;
  provinceName: string;
  facilities: CanadaFacilityRecord[];
  totalFacilities: number;
  cities: ProvinceCitySummary[];
  averageRating: number | null;
  careTypes: string[];
};

export type CanadaDirectoryItem = {
  provinceSlug: string;
  provinceName: string;
  totalFacilities: number;
  cities: { citySlug: string; cityName: string }[];
};

/** Normalize accented characters (e.g. é, è, ô) to ASCII for URL-safe slugs (Quebec data). */
function normalizeForSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(text: string | null | undefined): string {
  return normalizeForSlug((text ?? "").trim())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function transformCanadaFacilities(
  facilities: CanadaFacilityRaw[],
  provinceName: string,
  provinceSlug: string,
): CanadaRawFacility[] {
  const valid = facilities.filter((f) => (f.city ?? "").trim() !== "");
  return valid.map((f, index) => {
    const citySlug = slugify(f.city);
    const nameSlug = slugify(f.name);
    const id = `ca-${provinceSlug}-${nameSlug}-${citySlug}-${index}`;
    const addressParts = (f.address || "").split(",").map((s) => s.trim());
    const addressLine1 = addressParts[0] ?? f.address ?? "";
    const addressLine2 =
      addressParts.length > 1 ? addressParts.slice(1).join(", ") : undefined;
    const fullAddress = (f.address ?? "").trim();
    const pid = f.place_id?.trim();
    /** Canadian exports: use place_id when present; otherwise address search. */
    const mapsUrl = pid
      ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(pid)}`
      : fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
        : undefined;
    return {
      id,
      name: f.name,
      province: provinceName,
      provinceSlug,
      city: f.city,
      citySlug,
      addressLine1,
      addressLine2: addressLine2 || null,
      phone: f.phone ?? null,
      websiteUrl: f.website ?? null,
      mapsUrl: mapsUrl ?? null,
      rating: f.rating ?? null,
      reviewCount: f.reviews ?? null,
      careTypes: f.care_type ? [f.care_type] : [],
      featured: f.featured ?? undefined,
      premium: f.premium ?? undefined,
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

const PROVINCE_DATA: Record<string, CanadaRawFacility[]> = {};
for (const slug of discoverCanadaProvinceSlugsFromData()) {
  const raw = loadCanadaProvinceRawArray(slug);
  const provinceName =
    (raw[0]?.province ?? raw[0]?.state ?? "").trim() ||
    PROVINCE_DISPLAY_NAMES[slug] ||
    slug;
  PROVINCE_DATA[slug] = transformCanadaFacilities(raw, provinceName, slug);
}

/** Sync totals for homepage / global stats (US module aggregates with this). */
export function getCanadaStatsForGlobal(): {
  totalFacilities: number;
  totalCities: number;
  ratings: number[];
} {
  const cityKeys = new Set<string>();
  const ratings: number[] = [];
  let totalFacilities = 0;
  for (const [provinceSlug, facilities] of Object.entries(PROVINCE_DATA)) {
    totalFacilities += facilities.length;
    for (const f of facilities) {
      cityKeys.add(`${provinceSlug}:${f.citySlug}`);
      const r = f.rating;
      if (typeof r === "number" && !Number.isNaN(r) && r > 0) {
        ratings.push(r);
      }
    }
  }
  return { totalFacilities, totalCities: cityKeys.size, ratings };
}

export function getCanadaNationwideStats(): {
  provinceCount: number;
  totalFacilities: number;
  totalCities: number;
  averageRating: number | null;
} {
  const { totalFacilities, totalCities, ratings } = getCanadaStatsForGlobal();
  const provinceCount = Object.keys(PROVINCE_DATA).length;
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : null;
  return {
    provinceCount,
    totalFacilities,
    totalCities,
    averageRating,
  };
}

function toCanadaFacilityRecord(raw: CanadaRawFacility): CanadaFacilityRecord {
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
    state: raw.province,
    stateSlug: raw.provinceSlug,
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

export async function getProvinceSummary(
  provinceSlug: string,
): Promise<ProvinceSummary> {
  const safeSlug = (provinceSlug ?? "").toLowerCase();
  const rawFacilities = PROVINCE_DATA[safeSlug] ?? [];
  const facilities = rawFacilities.map(toCanadaFacilityRecord);

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
    const key = facility.citySlug.toLowerCase();
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

  const cities: ProvinceCitySummary[] = Array.from(cityMap.values())
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
    .map((f) => f.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" && rating > 0 && !Number.isNaN(rating),
    );
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1),
        )
      : null;

  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((f) => f.careTypes ?? [])
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const provinceName =
    facilities[0]?.state ??
    PROVINCE_DISPLAY_NAMES[safeSlug] ??
    safeSlug;

  return {
    provinceSlug: safeSlug,
    provinceName,
    facilities,
    totalFacilities,
    cities,
    averageRating,
    careTypes,
  };
}

export async function getCanadaCityFacilities(
  provinceSlug: string,
  citySlug: string,
): Promise<{
  provinceName: string;
  cityName: string;
  facilities: CanadaFacilityRecord[];
  totalFacilities: number;
  citiesCount: number;
}> {
  const summary = await getProvinceSummary(provinceSlug ?? "");
  const normalizedCity = (citySlug ?? "").toLowerCase();
  const facilities = summary.facilities.filter(
    (f) => f.citySlug.toLowerCase() === normalizedCity,
  );
  const cityName =
    facilities[0]?.city ??
    (normalizedCity.length > 0
      ? normalizedCity[0].toUpperCase() + normalizedCity.slice(1)
      : normalizedCity);

  return {
    provinceName: summary.provinceName,
    cityName,
    facilities,
    totalFacilities: summary.totalFacilities,
    citiesCount: summary.cities.length,
  };
}

export async function getCanadaDirectoryIndex(): Promise<CanadaDirectoryItem[]> {
  const slugs = Object.keys(PROVINCE_DATA);
  const result: CanadaDirectoryItem[] = [];
  for (const slug of slugs) {
    const summary = await getProvinceSummary(slug);
    result.push({
      provinceSlug: summary.provinceSlug,
      provinceName: summary.provinceName,
      totalFacilities: summary.totalFacilities,
      cities: summary.cities.map((c) => ({
        citySlug: c.citySlug,
        cityName: c.cityName,
      })),
    });
  }
  result.sort((a, b) => a.provinceName.localeCompare(b.provinceName));
  return result;
}

export async function getOtherCitiesInProvince(
  provinceSlug: string,
  currentCitySlug: string,
  limit = 6,
): Promise<ProvinceCitySummary[]> {
  const summary = await getProvinceSummary(provinceSlug ?? "");
  const cities = summary.cities;
  const targetSlug = (currentCitySlug ?? "").toLowerCase();
  const currentIndex = cities.findIndex(
    (c) => c.citySlug.toLowerCase() === targetSlug,
  );
  const filtered = cities.filter(
    (c) => c.citySlug.toLowerCase() !== targetSlug,
  );
  if (currentIndex === -1) return filtered.slice(0, limit);

  const result: ProvinceCitySummary[] = [];
  let left = currentIndex - 1;
  let right = currentIndex + 1;
  while (result.length < limit && (left >= 0 || right < cities.length)) {
    if (left >= 0) {
      result.push(cities[left]);
      left--;
    }
    if (result.length < limit && right < cities.length) {
      result.push(cities[right]);
      right++;
    }
  }
  return result.slice(0, limit);
}
