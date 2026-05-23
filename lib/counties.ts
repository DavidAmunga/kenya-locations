/**
 * Tree-shakeable exports for county-related functions
 */

import type { County, Constituency, Locality, Area, Ward } from "./types";
import { counties } from "./data/counties";
import { constituencies } from "./data/constituencies";
import { localities } from "./data/locality";
import { areas } from "./data/area";
import { wards } from "./data/wards";
import { buildLookupMap, buildGroupMap } from "./utils/maps";

// --- Lookup Maps ---
const countyCodeMap = buildLookupMap(counties, (c) => c.code);
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());
const constituencyNameMap = buildLookupMap(constituencies, (c) =>
  c.name.toLowerCase()
);

// --- Relationship Maps ---
const countyToConstituenciesMap = buildGroupMap(
  constituencies,
  (c) => countyNameMap.get(c.county.toLowerCase())?.code
);
const countyToLocalitiesMap = buildGroupMap(localities, (l) => l.county);
const countyToAreasMap = buildGroupMap(areas, (a) => a.county);
const countyToWardsMap = buildGroupMap(wards, (w) => {
  const constituency = constituencyNameMap.get(w.constituency.toLowerCase());
  return constituency
    ? countyNameMap.get(constituency.county.toLowerCase())?.code
    : undefined;
});

/**
 * County wrapper class with methods to access related data
 */
export class CountyWrapper {
  private readonly _data: County;

  constructor(data: County) {
    this._data = data;
  }

  /** Get the county code */
  get code(): string {
    return this._data.code;
  }

  /** Get the county name */
  get name(): string {
    return this._data.name;
  }

  /** Get all data for the county */
  get data(): County {
    return { ...this._data };
  }

  /**
   * Get all constituencies in this county
   */
  constituencies(): Constituency[] {
    return countyToConstituenciesMap.get(this._data.code) ?? [];
  }

  /**
   * Get all localities in this county
   */
  localities(): Locality[] {
    return countyToLocalitiesMap.get(this._data.name) ?? [];
  }

  /**
   * Get all areas in this county
   */
  areas(): Area[] {
    return countyToAreasMap.get(this._data.name) ?? [];
  }

  /**
   * Get all wards in this county
   */
  wards(): Ward[] {
    return countyToWardsMap.get(this._data.code) ?? [];
  }

  /**
   * Get areas by locality name
   */
  areasByLocality(localityName: string): Area[] {
    return this.areas().filter(
      (a) => a.locality.toLowerCase() === localityName.toLowerCase()
    );
  }
}

/**
 * Get all counties
 * @returns Array of all counties
 * @example
 * ```ts
 * import { getCounties } from 'kenya-locations/counties';
 * const counties = getCounties();
 * ```
 */
export function getCounties(): County[] {
  return counties;
}

/**
 * Get a county by its code
 * @param code County code (e.g., '001', '047')
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyByCode } from 'kenya-locations/counties';
 * const mombasa = getCountyByCode('001');
 * ```
 */
export function getCountyByCode(code: string): County | undefined {
  return countyCodeMap.get(code);
}

/**
 * Get a county by name
 * @param name County name (case-insensitive)
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyByName } from 'kenya-locations/counties';
 * const nairobi = getCountyByName('Nairobi');
 * ```
 */
export function getCountyByName(name: string): County | undefined {
  return countyNameMap.get(name.toLowerCase());
}

/**
 * Get a county by name or code with chainable methods
 * @param nameOrCode County name or code
 * @returns CountyWrapper instance or undefined if not found
 * @example
 * ```ts
 * import { county } from 'kenya-locations/counties';
 * const nairobi = county('Nairobi');
 * const constituencies = nairobi?.constituencies();
 * ```
 */
export function county(nameOrCode: string): CountyWrapper | undefined {
  const found =
    countyCodeMap.get(nameOrCode) ??
    countyNameMap.get(nameOrCode.toLowerCase());
  return found ? new CountyWrapper(found) : undefined;
}

// Export types
export type { County };
