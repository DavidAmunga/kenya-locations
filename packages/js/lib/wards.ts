/**
 * Tree-shakeable exports for ward-related functions
 */

import type { Ward, County, SubCounty } from "./types";
import { wards } from "./data/wards";
import { counties } from "./data/counties";
import { constituencies } from "./data/constituencies";
import { subCounties } from "./data/sub-counties";
import { buildLookupMap, buildGroupMap } from "./utils/maps";
import { ConstituencyWrapper } from "./constituencies";

// --- Lookup Maps ---
const wardCodeMap = buildLookupMap(wards, (w) => w.code);
const wardNameMap = buildLookupMap(wards, (w) => w.name.toLowerCase());
const countyCodeMap = buildLookupMap(counties, (c) => c.code);
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());
const constituencyNameMap = buildLookupMap(constituencies, (c) =>
  c.name.toLowerCase()
);
const subCountyNameMap = buildLookupMap(subCounties, (sc) =>
  sc.name.toLowerCase()
);

// --- Relationship Maps ---
// constituency code/name → county code (both keyed for fast lookup)
const constituencyToCountyCodeMap: Map<string, string> = new Map(
  constituencies.flatMap((c) => {
    const countyCode = countyNameMap.get(c.county.toLowerCase())?.code;
    return countyCode
      ? [
          [c.code, countyCode] as [string, string],
          [c.name, countyCode] as [string, string],
        ]
      : [];
  })
);

const countyToWardsMap = buildGroupMap(wards, (w) => {
  const constituency = constituencyNameMap.get(w.constituency.toLowerCase());
  return constituency
    ? countyNameMap.get(constituency.county.toLowerCase())?.code
    : undefined;
});

/**
 * Get all wards
 * @returns Array of all wards
 * @example
 * ```ts
 * import { getWards } from 'kenya-locations/wards';
 * const wards = getWards();
 * ```
 */
export function getWards(): Ward[] {
  return wards;
}

/**
 * Get a ward by code
 * @param code Ward code
 * @returns Ward object or undefined if not found
 * @example
 * ```ts
 * import { getWardByCode } from 'kenya-locations/wards';
 * const ward = getWardByCode('0001');
 * ```
 */
export function getWardByCode(code: string): Ward | undefined {
  return wardCodeMap.get(code);
}

/**
 * Get a ward by name (case-insensitive)
 * Note: Multiple wards may have the same name in different constituencies
 * @param name Ward name
 * @returns Ward object or undefined if not found
 * @example
 * ```ts
 * import { getWardByName } from 'kenya-locations/wards';
 * const ward = getWardByName('Mountain View');
 * ```
 */
export function getWardByName(name: string): Ward | undefined {
  return wardNameMap.get(name.toLowerCase());
}

/**
 * Get all wards in a county
 * @param countyNameOrCode County name or code
 * @returns Array of wards in the county
 * @example
 * ```ts
 * import { getWardsInCounty } from 'kenya-locations/wards';
 * const wardsInNairobi = getWardsInCounty('Nairobi');
 * ```
 */
export function getWardsInCounty(countyNameOrCode: string): Ward[] {
  if (countyToWardsMap.has(countyNameOrCode)) {
    return countyToWardsMap.get(countyNameOrCode) ?? [];
  }
  const county = countyNameMap.get(countyNameOrCode.toLowerCase());
  return county ? (countyToWardsMap.get(county.code) ?? []) : [];
}

/**
 * Get the county that a ward belongs to by ward name or code
 * @param wardNameOrCode Ward name or code
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyOfWard } from 'kenya-locations/wards';
 * const county = getCountyOfWard('0001');
 * ```
 */
export function getCountyOfWard(wardNameOrCode: string): County | undefined {
  const ward =
    wardCodeMap.get(wardNameOrCode) ??
    wardNameMap.get(wardNameOrCode.toLowerCase());
  if (!ward) return undefined;

  const countyCode = constituencyToCountyCodeMap.get(ward.constituency);
  return countyCode ? countyCodeMap.get(countyCode) : undefined;
}

/**
 * Get the constituency a ward belongs to by ward name or code
 * @param wardNameOrCode Ward name or code
 * @returns ConstituencyWrapper or undefined if not found
 * @example
 * ```ts
 * import { getConstituencyOfWard } from 'kenya-locations/wards';
 * const constituency = getConstituencyOfWard('0001');
 * ```
 */
export function getConstituencyOfWard(
  wardNameOrCode: string
): ConstituencyWrapper | undefined {
  const ward =
    wardCodeMap.get(wardNameOrCode) ??
    wardNameMap.get(wardNameOrCode.toLowerCase());
  if (!ward) return undefined;
  const found = constituencyNameMap.get(ward.constituency.toLowerCase());
  return found ? new ConstituencyWrapper(found) : undefined;
}

/**
 * Get the sub-county a ward belongs to by ward name or code.
 * Sub-county names correspond to constituency names in the ward dataset.
 * @param wardNameOrCode Ward name or code
 * @returns SubCounty or undefined if not found
 * @example
 * ```ts
 * import { getSubCountyOfWard } from 'kenya-locations/wards';
 * const subCounty = getSubCountyOfWard('0001');
 * ```
 */
export function getSubCountyOfWard(
  wardNameOrCode: string
): SubCounty | undefined {
  const ward =
    wardCodeMap.get(wardNameOrCode) ??
    wardNameMap.get(wardNameOrCode.toLowerCase());
  if (!ward) return undefined;
  return subCountyNameMap.get(ward.constituency.toLowerCase());
}

// Export types
export type { Ward };
