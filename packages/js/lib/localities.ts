/**
 * Tree-shakeable exports for locality-related functions
 */

import type { Locality, Area, County } from "./types";
import { localities } from "./data/locality";
import { areas } from "./data/area";
import { counties } from "./data/counties";
import { LocationNotFoundError } from "./errors/LocationErrors";
import { buildLookupMap, buildGroupMap } from "./utils/maps";

// --- Lookup Maps ---
const localityNameMap = buildLookupMap(localities, (l) => l.name.toLowerCase());
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());

// --- Relationship Maps ---
const countyToLocalitiesMap = buildGroupMap(localities, (l) => l.county);
const localityToAreasMap = buildGroupMap(areas, (a) => a.locality);

/**
 * Locality wrapper class with methods to access related data
 */
export class LocalityWrapper {
  private readonly _data: Locality;

  constructor(data: Locality) {
    this._data = data;
  }

  /** Get the locality name */
  get name(): string {
    return this._data.name;
  }

  /** Get the county this locality belongs to */
  get county(): string {
    return this._data.county;
  }

  /** Get all data for the locality */
  get data(): Locality {
    return { ...this._data };
  }

  /**
   * Get all areas in this locality
   */
  areas(): Area[] {
    return localityToAreasMap.get(this._data.name) ?? [];
  }

  /**
   * Get an area by name
   * @param name Name of the area
   * @throws LocationNotFoundError if not found
   */
  area(name: string): Area {
    const found = this.areas().find(
      (a) => a.name.toLowerCase() === name.toLowerCase()
    );
    if (found) return found;
    throw new LocationNotFoundError("Area", name);
  }

  /**
   * Get the county this locality belongs to
   */
  getCounty(): County | undefined {
    return countyNameMap.get(this._data.county.toLowerCase());
  }
}

/**
 * Get all localities
 * @returns Array of all localities
 * @example
 * ```ts
 * import { getLocalities } from 'kenya-locations/localities';
 * const localities = getLocalities();
 * ```
 */
export function getLocalities(): Locality[] {
  return localities;
}

/**
 * Get a locality by its name
 * @param name Locality name (case-insensitive)
 * @returns LocalityWrapper instance or undefined if not found
 * @example
 * ```ts
 * import { getLocalityByName } from 'kenya-locations/localities';
 * const westlands = getLocalityByName('Westlands');
 * ```
 */
export function getLocalityByName(name: string): LocalityWrapper | undefined {
  const found = localityNameMap.get(name.toLowerCase());
  return found ? new LocalityWrapper(found) : undefined;
}

/**
 * Get all localities in a county
 * @param countyName County name
 * @returns Array of localities in the county
 * @example
 * ```ts
 * import { getLocalitiesInCounty } from 'kenya-locations/localities';
 * const nairobiLocalities = getLocalitiesInCounty('Nairobi');
 * ```
 */
export function getLocalitiesInCounty(countyName: string): Locality[] {
  return countyToLocalitiesMap.get(countyName) ?? [];
}

/**
 * Get the county of a locality
 * @param localityName The name of the locality
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyOfLocality } from 'kenya-locations/localities';
 * const county = getCountyOfLocality('Westlands');
 * ```
 */
export function getCountyOfLocality(localityName: string): County | undefined {
  const locality = localityNameMap.get(localityName.toLowerCase());
  if (!locality) return undefined;
  return countyNameMap.get(locality.county.toLowerCase());
}

/**
 * Get a locality by name with optional county filter
 * @param name Locality name
 * @param countyName Optional county name to filter by
 * @returns LocalityWrapper instance or undefined if not found
 * @example
 * ```ts
 * import { locality } from 'kenya-locations/localities';
 * const westlands = locality('Westlands', 'Nairobi');
 * ```
 */
/**
 * Get all localities matching a name across all counties.
 * Useful when the same locality name exists in more than one county.
 * @param name Locality name (case-insensitive)
 * @returns Array of LocalityWrapper instances
 * @example
 * ```ts
 * import { getLocalitiesByName } from 'kenya-locations/localities';
 * const allTown = getLocalitiesByName('Town');
 * ```
 */
export function getLocalitiesByName(name: string): LocalityWrapper[] {
  return localities
    .filter((l) => l.name.toLowerCase() === name.toLowerCase())
    .map((l) => new LocalityWrapper(l));
}

export function locality(
  name: string,
  countyName?: string
): LocalityWrapper | undefined {
  if (countyName) {
    const found = (countyToLocalitiesMap.get(countyName) ?? []).find(
      (l) => l.name.toLowerCase() === name.toLowerCase()
    );
    return found ? new LocalityWrapper(found) : undefined;
  }
  const found = localityNameMap.get(name.toLowerCase());
  return found ? new LocalityWrapper(found) : undefined;
}

// Export types
export type { Locality };
