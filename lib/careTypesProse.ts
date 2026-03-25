/**
 * Turn raw Google-style category labels into short, natural phrases for prose
 * (e.g. city page intros). Omits entries that do not look dental-related.
 */

const EXACT_PHRASE: Record<string, string> = {
  dentist: "general dentists",
  "general dentist": "general dentists",
  dental: "general dental care",
  "dental clinic": "dental clinics",
  "dental hygienist": "dental hygienists",
  "cosmetic dentist": "cosmetic dentists",
  "pediatric dentist": "pediatric dentists",
  "pediatric dentistry clinic": "pediatric dentistry clinics",
  endodontist: "endodontists",
  orthodontist: "orthodontists",
  periodontist: "periodontists",
  prosthodontist: "prosthodontists",
  "oral surgeon": "oral surgeons",
  "oral and maxillofacial surgeon": "oral and maxillofacial surgeons",
  "dental implants periodontist": "implant and periodontal specialists",
  "dental implants provider": "implant providers",
  "emergency dental service": "emergency dental care",
  "teeth whitening service": "teeth whitening",
  "denture care center": "denture care",
  "dental laboratory": "dental labs",
  "dental radiology": "dental imaging",
  "dental school": "dental education programs",
  "dental supply store": "dental supplies",
  dentiste: "dentists",
  dentista: "dentists",
  "dentista infantil": "pediatric dentists",
  "dentista cosmético": "cosmetic dentists",
  "dokter spesialis periodontis implan gigi": "implant and periodontal specialists",
  "clínica dental": "dental clinics",
  "cabinet dentaire": "dental practices",
  "laboratorio dental": "dental labs",
};

const DENTALISH =
  /dental|dentist|dentiste|dentista|odontolog|orthodont|periodont|endodont|prosthodont|implan|teeth|denture|hygien|cosmetic|pediatric|maxillofacial|oral\s+surgeon|whiten|cabinet\s+dentaire|clínica\s+dental|laboratorio\s+dental/i;

/** Labels that match "dent" but are not oral health (e.g. auto body). */
const NON_DENTAL = /auto\s+dent|orthodox\s+church|student\s+dormitory|orthopedic|orthotics\s*&|dental\s+insurance\s+agency/i;

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Fallback: lowercase prose, light plural / phrasing for service-style labels. */
function humanizeFallback(raw: string): string {
  let s = raw.trim().toLowerCase();
  if (!s) return "";
  if (s.endsWith(" service")) {
    return `${s.slice(0, -" service".length)} services`;
  }
  if (s.endsWith(" clinic")) {
    return s.replace(/ clinic$/, " clinics");
  }
  if (s.endsWith(" center")) {
    return s.replace(/ center$/, " centers");
  }
  if (s.endsWith("ist") && !s.endsWith("dentist")) {
    return `${s}s`;
  }
  if (!s.endsWith("s")) {
    return `${s}s`;
  }
  return s;
}

function phraseForLabel(raw: string): string | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (NON_DENTAL.test(key)) return null;
  if (EXACT_PHRASE[key]) return EXACT_PHRASE[key];
  if (!DENTALISH.test(raw)) return null;
  return humanizeFallback(raw);
}

function oxfordJoin(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * @param careTypes Raw labels from listings (dedupe before calling if needed).
 * @param maxItems Cap how many categories appear in the sentence (default 5).
 * @returns Clause starting with "including …" or a neutral fallback (no leading "including" duplicate in caller).
 */
export function formatCareTypesClause(
  careTypes: string[],
  maxItems = 5,
): string {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of careTypes) {
    const p = phraseForLabel(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    phrases.push(p);
    if (phrases.length >= maxItems) break;
  }
  if (phrases.length === 0) {
    return "including general and specialty dental care";
  }
  return `including ${oxfordJoin(phrases)}`;
}
