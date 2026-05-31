/**
 * Tree-shakeable exports for area-related functions
 */

import type { Area, Locality, County } from "./types";
import { areas } from "./data/area";
import { localities } from "./data/locality";
import { counties } from "./data/counties";
import { buildLookupMap, buildGroupMap } from "./utils/maps";

// --- Lookup Maps ---
const areaNameMap = buildLookupMap(areas, (a) => a.name.toLowerCase());
const areasByNameMap = buildGroupMap(areas, (a) => a.name.toLowerCase());
const localityNameMap = buildLookupMap(localities, (l) => l.name.toLowerCase());
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());

// --- Relationship Maps ---
const localityToAreasMap = buildGroupMap(areas, (a) => a.locality);
const countyToAreasMap = buildGroupMap(areas, (a) => a.county);

/**
 * Get all areas
 * @returns Array of all areas
 * @example
 * ```ts
 * import { getAreas } from 'kenya-locations/areas';
 * const areas = getAreas();
 * ```
 */
export function getAreas(): Area[] {
  return areas;
}

/**
 * Get an area by its name
 * @param name Area name (case-insensitive)
 * @returns Area object or undefined if not found
 * @example
 * ```ts
 * import { getAreaByName } from 'kenya-locations/areas';
 * const gigiri = getAreaByName('Gigiri');
 * ```
 */
export function getAreaByName(name: string): Area | undefined {
  return areaNameMap.get(name.toLowerCase());
}

/**
 * Get all areas in a locality
 * @param localityName Locality name
 * @returns Array of areas in the locality
 * @example
 * ```ts
 * import { getAreasInLocality } from 'kenya-locations/areas';
 * const westlandsAreas = getAreasInLocality('Westlands');
 * ```
 */
export function getAreasInLocality(localityName: string): Area[] {
  return localityToAreasMap.get(localityName) ?? [];
}

/**
 * Get all areas in a county
 * @param countyName County name
 * @returns Array of areas in the county
 * @example
 * ```ts
 * import { getAreasInCounty } from 'kenya-locations/areas';
 * const nairobiAreas = getAreasInCounty('Nairobi');
 * ```
 */
export function getAreasInCounty(countyName: string): Area[] {
  return countyToAreasMap.get(countyName) ?? [];
}

/**
 * Get the county of an area
 * @param areaName The name of the area
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyOfArea } from 'kenya-locations/areas';
 * const county = getCountyOfArea('Gigiri');
 * ```
 */
export function getCountyOfArea(areaName: string): County | undefined {
  const area = areaNameMap.get(areaName.toLowerCase());
  if (!area) return undefined;
  return countyNameMap.get(area.county.toLowerCase());
}

/**
 * Get the locality of an area
 * @param areaName The name of the area
 * @returns Locality object or undefined if not found
 * @example
 * ```ts
 * import { getLocalityOfArea } from 'kenya-locations/areas';
 * const locality = getLocalityOfArea('Gigiri');
 * ```
 */
export function getLocalityOfArea(areaName: string): Locality | undefined {
  const area = areaNameMap.get(areaName.toLowerCase());
  if (!area) return undefined;
  return localityNameMap.get(area.locality.toLowerCase());
}

/**
 * Get all areas matching a name across all localities.
 * Useful when the same area name exists in more than one locality.
 * @param name Area name (case-insensitive)
 * @returns Array of Area objects
 * @example
 * ```ts
 * import { getAreasByName } from 'kenya-locations/areas';
 * const allTown = getAreasByName('Town');
 * ```
 */
export function getAreasByName(name: string): Area[] {
  return areasByNameMap.get(name.toLowerCase()) ?? [];
}

// Export types
export type { Area };
