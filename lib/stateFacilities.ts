import type { Facility } from "@/components/FacilityCard";
import fs from "fs";
import path from "path";

// Some CI/build environments only include a subset of `data/*_facilities.json`.
// Treat missing files as an empty dataset so the app can still build.
const _originalReadFileSync = fs.readFileSync.bind(fs);
(fs as any).readFileSync = (filePath: string, encoding?: any) => {
  try {
    return _originalReadFileSync(filePath, encoding);
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      return encoding ? "[]" : Buffer.from("[]", "utf8");
    }
    throw err;
  }
};

// Build-time empty datasets.
// This Next.js app is allowed to build with an empty `data/` folder
// (no JSON files).
const floridaData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/florida_facilities.json'), 'utf-8'),
);
const californiaData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/california_facilities.json'), 'utf-8'),
);
const texasData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/texas_facilities.json'), 'utf-8'),
);
const newYorkData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/new-york_facilities.json'), 'utf-8'),
);
const iowaData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/iowa_facilities.json'), 'utf-8'),
);
const oklahomaData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/oklahoma_facilities.json'), 'utf-8'),
);

const arizonaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/arizona_facilities.json'), 'utf-8'),
  ),
  state: "Arizona",
} as any;
const illinoisData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/illinois_facilities.json'), 'utf-8'),
  ),
  state: "Illinois",
} as any;
const ohioData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/ohio_facilities.json'), 'utf-8'),
  ),
  state: "Ohio",
} as any;
const michiganData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/michigan_facilities.json'), 'utf-8'),
  ),
  state: "Michigan",
} as any;
const southCarolinaData = {
  facilities: JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data/south-carolina_facilities.json'),
      'utf-8',
    ),
  ),
  state: "South Carolina",
} as any;
const marylandData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/maryland_facilities.json'), 'utf-8'),
  ),
  state: "Maryland",
} as any;
const newMexicoData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/new-mexico_facilities.json'), 'utf-8'),
  ),
  state: "New Mexico",
} as any;
const kansasData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/kansas_facilities.json'), 'utf-8'),
  ),
  state: "Kansas",
} as any;
const hawaiiData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/hawaii_facilities.json'), 'utf-8'),
  ),
  state: "Hawaii",
} as any;
const wisconsinData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/wisconsin_facilities.json'), 'utf-8'),
  ),
  state: "Wisconsin",
} as any;
const missouriData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/missouri_facilities.json'), 'utf-8'),
  ),
  state: "Missouri",
} as any;
const indianaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/indiana_facilities.json'), 'utf-8'),
  ),
  state: "Indiana",
} as any;
const northCarolinaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/north-carolina_facilities.json'), 'utf-8'),
  ),
  state: "North Carolina",
} as any;
const utahData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/utah_facilities.json'), 'utf-8'),
  ),
  state: "Utah",
} as any;
const virginiaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/virginia_facilities.json'), 'utf-8'),
  ),
  state: "Virginia",
} as any;
const nebraskaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/nebraska_facilities.json'), 'utf-8'),
  ),
  state: "Nebraska",
} as any;
const arkansasData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/arkansas_facilities.json'), 'utf-8'),
  ),
  state: "Arkansas",
} as any;
const tennesseeData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/tennessee_facilities.json'), 'utf-8'),
  ),
  state: "Tennessee",
} as any;
const kentuckyData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/kentucky_facilities.json'), 'utf-8'),
  ),
  state: "Kentucky",
} as any;
const minnesotaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/minnesota_facilities.json'), 'utf-8'),
  ),
  state: "Minnesota",
} as any;
const idahoData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/idaho_facilities.json'), 'utf-8'),
  ),
  state: "Idaho",
} as any;
const newJerseyData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/new-jersey_facilities.json'), 'utf-8'),
  ),
  state: "New Jersey",
} as any;
const connecticutData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/connecticut_facilities.json'), 'utf-8'),
  ),
  state: "Connecticut",
} as any;
const coloradoData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/colorado_facilities.json'), 'utf-8'),
  ),
  state: "Colorado",
} as any;
const georgiaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/georgia_facilities.json'), 'utf-8'),
  ),
  state: "Georgia",
} as any;
const nevadaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/nevada_facilities.json'), 'utf-8'),
  ),
  state: "Nevada",
} as any;
const alabamaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/alabama_facilities.json'), 'utf-8'),
  ),
  state: "Alabama",
} as any;
const louisianaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/louisiana_facilities.json'), 'utf-8'),
  ),
  state: "Louisiana",
} as any;
const oregonData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/oregon_facilities.json'), 'utf-8'),
  ),
  state: "Oregon",
} as any;
const newHampshireData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/new-hampshire_facilities.json'), 'utf-8'),
  ),
  state: "New Hampshire",
} as any;
const washingtonData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/washington_facilities.json'), 'utf-8'),
  ),
  state: "Washington",
} as any;
const massachusettsData = {
  facilities: JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data/massachusetts_facilities.json'),
      'utf-8',
    ),
  ),
  state: "Massachusetts",
} as any;
const vermontData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/vermont_facilities.json'), 'utf-8'),
  ),
  state: "Vermont",
} as any;
const rhodeIslandData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/rhode-island_facilities.json'), 'utf-8'),
  ),
  state: "Rhode Island",
} as any;
const mississippiData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/mississippi_facilities.json'), 'utf-8'),
  ),
  state: "Mississippi",
} as any;
const montanaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/montana_facilities.json'), 'utf-8'),
  ),
  state: "Montana",
} as any;
const washingtonDcData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/washington-dc_facilities.json'), 'utf-8'),
  ),
  state: "Washington, DC",
} as any;
const northDakotaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/north-dakota_facilities.json'), 'utf-8'),
  ),
  state: "North Dakota",
} as any;
const southDakotaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/south-dakota_facilities.json'), 'utf-8'),
  ),
  state: "South Dakota",
} as any;
const wyomingData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/wyoming_facilities.json'), 'utf-8'),
  ),
  state: "Wyoming",
} as any;
const pennsylvaniaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/pennsylvania_facilities.json'), 'utf-8'),
  ),
  state: "Pennsylvania",
} as any;
const alaskaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/alaska_facilities.json'), 'utf-8'),
  ),
  state: "Alaska",
} as any;
const delawareData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/delaware_facilities.json'), 'utf-8'),
  ),
  state: "Delaware",
} as any;
const westVirginiaData = {
  facilities: JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/west-virginia_facilities.json'), 'utf-8'),
  ),
  state: "West Virginia",
} as any;

type AlternateFormatFacilityRaw = {
  name: string;
  care_type?: string;
  type?: string;
  address: string;
  city: string;
  state: string;
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
  const valid = facilities.filter(
    (f) => ((f.city ?? "").trim() !== ""),
  );
  return valid.map((f, index) => {
    const citySlug = slugify(f.city);
    const nameSlug = slugify(f.name);
    const id = `${nameSlug}-${citySlug}-${index}`;
    const addressParts = ((f.address ?? "").trim() || "").split(",").map((s) => s.trim());
    const addressLine1 = addressParts[0] ?? "";
    const addressLine2 = addressParts.length > 1 ? addressParts.slice(1).join(", ") : undefined;
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
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

const floridaFacilities = transformAlternateFormatFacilities(
  floridaData as unknown as AlternateFormatFacilityRaw[],
  "Florida",
  "florida",
);

const texasFacilities = transformAlternateFormatFacilities(
  texasData as unknown as AlternateFormatFacilityRaw[],
  "Texas",
  "texas",
);

const californiaFacilities = transformAlternateFormatFacilities(
  californiaData as unknown as AlternateFormatFacilityRaw[],
  "California",
  "california",
);

const newYorkFacilities = transformAlternateFormatFacilities(
  newYorkData as unknown as AlternateFormatFacilityRaw[],
  "New York",
  "new-york",
);

const arizonaFacilities = transformAlternateFormatFacilities(
  (arizonaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (arizonaData as { state: string }).state,
  "arizona",
);

const illinoisFacilities = transformAlternateFormatFacilities(
  (illinoisData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (illinoisData as { state: string }).state,
  "illinois",
);

const ohioFacilities = transformAlternateFormatFacilities(
  (ohioData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (ohioData as { state: string }).state,
  "ohio",
);

const michiganFacilities = transformAlternateFormatFacilities(
  (michiganData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (michiganData as { state: string }).state,
  "michigan",
);

const southCarolinaFacilities = transformAlternateFormatFacilities(
  (southCarolinaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (southCarolinaData as { state: string }).state,
  "south-carolina",
);

const marylandFacilities = transformAlternateFormatFacilities(
  (marylandData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (marylandData as { state: string }).state,
  "maryland",
);

const newMexicoFacilities = transformAlternateFormatFacilities(
  (newMexicoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newMexicoData as { state: string }).state,
  "new-mexico",
);

const kansasFacilities = transformAlternateFormatFacilities(
  (kansasData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (kansasData as { state: string }).state,
  "kansas",
);

const hawaiiFacilities = transformAlternateFormatFacilities(
  (hawaiiData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (hawaiiData as { state: string }).state,
  "hawaii",
);

const wisconsinFacilities = transformAlternateFormatFacilities(
  (wisconsinData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (wisconsinData as { state: string }).state,
  "wisconsin",
);

const missouriFacilities = transformAlternateFormatFacilities(
  (missouriData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (missouriData as { state: string }).state,
  "missouri",
);

const indianaFacilities = transformAlternateFormatFacilities(
  (indianaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (indianaData as { state: string }).state,
  "indiana",
);

const northCarolinaFacilities = transformAlternateFormatFacilities(
  (northCarolinaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (northCarolinaData as { state: string }).state,
  "north-carolina",
);

const utahFacilities = transformAlternateFormatFacilities(
  (utahData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (utahData as { state: string }).state,
  "utah",
);

const virginiaFacilities = transformAlternateFormatFacilities(
  (virginiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (virginiaData as { state: string }).state,
  "virginia",
);

const nebraskaFacilities = transformAlternateFormatFacilities(
  (nebraskaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (nebraskaData as { state: string }).state,
  "nebraska",
);

const arkansasFacilities = transformAlternateFormatFacilities(
  (arkansasData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (arkansasData as { state: string }).state,
  "arkansas",
);

const tennesseeFacilities = transformAlternateFormatFacilities(
  (tennesseeData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (tennesseeData as { state: string }).state,
  "tennessee",
);

const kentuckyFacilities = transformAlternateFormatFacilities(
  (kentuckyData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (kentuckyData as { state: string }).state,
  "kentucky",
);

const minnesotaFacilities = transformAlternateFormatFacilities(
  (minnesotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (minnesotaData as { state: string }).state,
  "minnesota",
);

const idahoFacilities = transformAlternateFormatFacilities(
  (idahoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (idahoData as { state: string }).state,
  "idaho",
);

const oklahomaFacilities = oklahomaData as unknown as RawFacility[];

const iowaFacilities = transformAlternateFormatFacilities(
  iowaData as unknown as AlternateFormatFacilityRaw[],
  "Iowa",
  "iowa",
);

const newJerseyFacilities = transformAlternateFormatFacilities(
  (newJerseyData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newJerseyData as { state: string }).state,
  "new-jersey",
);

const connecticutFacilities = transformAlternateFormatFacilities(
  (connecticutData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (connecticutData as { state: string }).state,
  "connecticut",
);

const coloradoFacilities = transformAlternateFormatFacilities(
  (coloradoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (coloradoData as { state: string }).state,
  "colorado",
);

const georgiaFacilities = transformAlternateFormatFacilities(
  (georgiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (georgiaData as { state: string }).state,
  "georgia",
);

const nevadaFacilities = transformAlternateFormatFacilities(
  (nevadaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (nevadaData as { state: string }).state,
  "nevada",
);

const alabamaFacilities = transformAlternateFormatFacilities(
  (alabamaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (alabamaData as { state: string }).state,
  "alabama",
);

const louisianaFacilities = transformAlternateFormatFacilities(
  (louisianaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (louisianaData as { state: string }).state,
  "louisiana",
);

const oregonFacilities = transformAlternateFormatFacilities(
  (oregonData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (oregonData as { state: string }).state,
  "oregon",
);

const newHampshireFacilities = transformAlternateFormatFacilities(
  (newHampshireData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newHampshireData as { state: string }).state,
  "new-hampshire",
);

const washingtonFacilities = transformAlternateFormatFacilities(
  (washingtonData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (washingtonData as { state: string }).state,
  "washington",
);

const massachusettsFacilities = transformAlternateFormatFacilities(
  (massachusettsData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (massachusettsData as { state: string }).state,
  "massachusetts",
);

const vermontFacilities = transformAlternateFormatFacilities(
  (vermontData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (vermontData as { state: string }).state,
  "vermont",
);

const rhodeIslandFacilities = transformAlternateFormatFacilities(
  (rhodeIslandData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (rhodeIslandData as { state: string }).state,
  "rhode-island",
);

const mississippiFacilities = transformAlternateFormatFacilities(
  (mississippiData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (mississippiData as { state: string }).state,
  "mississippi",
);

const montanaFacilities = transformAlternateFormatFacilities(
  (montanaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (montanaData as { state: string }).state,
  "montana",
);

const washingtonDcFacilities = transformAlternateFormatFacilities(
  (washingtonDcData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (washingtonDcData as { state: string }).state,
  "washington-dc",
);

const northDakotaFacilities = transformAlternateFormatFacilities(
  (northDakotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (northDakotaData as { state: string }).state,
  "north-dakota",
);

const southDakotaFacilities = transformAlternateFormatFacilities(
  (southDakotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (southDakotaData as { state: string }).state,
  "south-dakota",
);

const wyomingFacilities = transformAlternateFormatFacilities(
  (wyomingData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (wyomingData as { state: string }).state,
  "wyoming",
);

const pennsylvaniaFacilities = transformAlternateFormatFacilities(
  (pennsylvaniaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (pennsylvaniaData as { state: string }).state,
  "pennsylvania",
);

const alaskaFacilities = transformAlternateFormatFacilities(
  (alaskaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (alaskaData as { state: string }).state,
  "alaska",
);

const delawareFacilities = transformAlternateFormatFacilities(
  (delawareData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (delawareData as { state: string }).state,
  "delaware",
);

const westVirginiaFacilities = transformAlternateFormatFacilities(
  (westVirginiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (westVirginiaData as { state: string }).state,
  "west-virginia",
);

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
  recommended?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

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

function fallbackStateNameFromSlug(stateSlug: string): string {
  return stateSlug
    .split("-")
    .map((part) => {
      if (!part) return part;
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
  // Newer data files are stored as a top-level array of facilities.
  if (Array.isArray(parsed)) {
    const facilitiesAll = parsed as AlternateFormatFacilityRaw[];
    // Canada province/territory files include a `country: "Canada"` field.
    // Skip them so they don't appear as US "state" directories.
    const facilities = facilitiesAll.filter(
      (f: any) => (f?.country ?? "").toLowerCase() !== "canada",
    );
    if (facilities.length === 0) return null;
    const stateName =
      (facilities[0]?.state ?? "").trim() || fallbackStateNameFromSlug(stateSlug);
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
      (f: any) => (f?.country ?? "").toLowerCase() !== "canada",
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

function loadStateDataFromDisk(): Record<string, RawFacility[]> {
  const result: Record<string, RawFacility[]> = {};
  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) return result;

  let entries: string[];
  try {
    entries = fs.readdirSync(dataDir);
  } catch {
    return result;
  }

  for (const entry of entries) {
    if (!entry.endsWith("_facilities.json")) continue;

    const stateSlug = entry
      .replace(/_facilities\.json$/i, "")
      .toLowerCase();
    if (!stateSlug) continue;

    const filePath = path.join(dataDir, entry);

    let parsed: unknown;
    try {
      const content = fs.readFileSync(filePath, "utf8");
      parsed = JSON.parse(content);
    } catch {
      continue;
    }

    const normalized = normalizeStateFacilitiesJson(parsed, stateSlug);
    if (!normalized) continue;

    const { stateName, facilities } = normalized;
    result[stateSlug] = transformAlternateFormatFacilities(
      facilities,
      stateName,
      stateSlug,
    );
  }

  return result;
}

const STATE_DATA: Record<string, RawFacility[]> = loadStateDataFromDisk();

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
      ? normalizedSlug[0]?.toUpperCase() + normalizedSlug.slice(1)
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
  { stateSlug: string; stateName: string; totalFacilities: number; cities: CitySummary[] }[]
> {
  const stateSlugs = Object.keys(STATE_DATA).sort();
  const summaries = await Promise.all(stateSlugs.map((slug) => getStateSummary(slug)));
  return summaries.map((summary) => ({
    stateSlug: summary.stateSlug,
    stateName: summary.stateName,
    totalFacilities: summary.totalFacilities,
    cities: summary.cities,
  }));
}

export type GlobalStats = {
  totalFacilities: number;
  totalCities: number;
  averageRating: number | null;
};

export function getGlobalStats(): GlobalStats {
  let totalFacilities = 0;
  const cityKeys = new Set<string>();
  const ratings: number[] = [];
  for (const facilities of Object.values(STATE_DATA)) {
    totalFacilities += facilities.length;
    for (const f of facilities) {
      cityKeys.add(`${f.stateSlug}:${f.citySlug}`);
      if (
        typeof f.rating === "number" &&
        !Number.isNaN(f.rating) &&
        f.rating > 0
      ) {
        ratings.push(f.rating);
      }
    }
  }
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : null;
  return {
    totalFacilities,
    totalCities: cityKeys.size,
    averageRating,
  };
}

export function getStateResourcesUrl(stateSlug: string): string {
  // Template link: the site ships without state-by-state auto repair data.
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

