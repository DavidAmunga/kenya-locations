/**
 * Tree-shakeable exports for sub-county-related functions
 */

import type { SubCounty, County, Ward } from "./types";
import { subCounties } from "./data/sub-counties";
import { counties } from "./data/counties";
import { wards } from "./data/wards";
import { buildLookupMap, buildGroupMap } from "./utils/maps";

// --- Lookup Maps ---
const countyCodeMap = buildLookupMap(counties, (c) => c.code);
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());
const subCountyCodeMap = buildLookupMap(subCounties, (sc) => sc.code);
const subCountyNameMap = buildLookupMap(subCounties, (sc) =>
  sc.name.toLowerCase()
);

// --- Relationship Maps ---
const countyToSubCountiesMap = buildGroupMap(subCounties, (sc) => {
  return (
    countyCodeMap.get(sc.county) ?? countyNameMap.get(sc.county.toLowerCase())
  )?.code;
});

/**
 * Get all sub-counties
 * @returns Array of all sub-counties
 * @example
 * ```ts
 * import { getSubCounties } from 'kenya-locations/sub-counties';
 * const subCounties = getSubCounties();
 * ```
 */
export function getSubCounties(): SubCounty[] {
  return subCounties;
}

/**
 * Get a sub-county by code
 * @param code Sub-county code
 * @returns SubCounty object or undefined if not found
 * @example
 * ```ts
 * import { getSubCountyByCode } from 'kenya-locations/sub-counties';
 * const subCounty = getSubCountyByCode('001');
 * ```
 */
export function getSubCountyByCode(code: string): SubCounty | undefined {
  return subCountyCodeMap.get(code);
}

/**
 * Get a sub-county by name
 * @param name Sub-county name (case-insensitive)
 * @returns SubCounty object or undefined if not found
 * @example
 * ```ts
 * import { getSubCountyByName } from 'kenya-locations/sub-counties';
 * const subCounty = getSubCountyByName('Westlands');
 * ```
 */
export function getSubCountyByName(name: string): SubCounty | undefined {
  return subCountyNameMap.get(name.toLowerCase());
}

/**
 * Get all sub-counties in a county
 * @param nameOrCode County name or code
 * @returns Array of sub-counties in the county
 * @example
 * ```ts
 * import { getSubCountiesInCounty } from 'kenya-locations/sub-counties';
 * const subCounties = getSubCountiesInCounty('Nairobi');
 * ```
 */
export function getSubCountiesInCounty(nameOrCode: string): SubCounty[] {
  if (countyToSubCountiesMap.has(nameOrCode)) {
    return countyToSubCountiesMap.get(nameOrCode) ?? [];
  }
  const county = countyNameMap.get(nameOrCode.toLowerCase());
  return county ? (countyToSubCountiesMap.get(county.code) ?? []) : [];
}

/**
 * Get the county of a sub-county
 * @param subCountyName The name of the sub-county
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyOfSubCounty } from 'kenya-locations/sub-counties';
 * const county = getCountyOfSubCounty('Westlands');
 * ```
 */
export function getCountyOfSubCounty(
  subCountyName: string
): County | undefined {
  const sc = subCountyNameMap.get(subCountyName.toLowerCase());
  return sc ? countyNameMap.get(sc.county.toLowerCase()) : undefined;
}

/**
 * Get all wards in a sub-county
 * @param subCountyCode Sub-county code
 * @returns Array of wards in the sub-county
 * @example
 * ```ts
 * import { getWardsInSubCounty } from 'kenya-locations/sub-counties';
 * const wards = getWardsInSubCounty('001');
 * ```
 */
export function getWardsInSubCounty(subCountyCode: string): Ward[] {
  return wards.filter((w) => w.constituency === subCountyCode);
}

// Export types
export type { SubCounty };
