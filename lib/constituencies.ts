/**
 * Tree-shakeable exports for constituency-related functions
 */

import type { Constituency, Ward, County } from "./types";
import { constituencies } from "./data/constituencies";
import { wards } from "./data/wards";
import { counties } from "./data/counties";
import { LocationError } from "./errors/LocationErrors";
import { buildLookupMap, buildGroupMap } from "./utils/maps";

// --- Lookup Maps ---
const constituencyCodeMap = buildLookupMap(constituencies, (c) => c.code);
const constituencyNameMap = buildLookupMap(constituencies, (c) =>
  c.name.toLowerCase()
);
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());
const wardNameMap = buildLookupMap(wards, (w) => w.name.toLowerCase());
const wardCodeMap = buildLookupMap(wards, (w) => w.code);

// --- Relationship Maps ---
const constituencyToWardsMap = buildGroupMap(wards, (w) => w.constituency);

/**
 * Constituency wrapper class with methods to access related data
 */
export class ConstituencyWrapper {
  private readonly _data: Constituency;

  constructor(data: Constituency) {
    this._data = data;
  }

  /** Get the constituency code */
  get code(): string {
    return this._data.code;
  }

  /** Get the constituency name */
  get name(): string {
    return this._data.name;
  }

  /** Get the county this constituency belongs to */
  get county(): string {
    return this._data.county;
  }

  /** Get all data for the constituency */
  get data(): Constituency {
    return { ...this._data };
  }

  /**
   * Get all wards in this constituency
   */
  wards(): Ward[] {
    return constituencyToWardsMap.get(this._data.name) ?? [];
  }

  /**
   * Get a ward in this constituency by name or code
   */
  ward(nameOrCode: string): Ward {
    const byCode = wardCodeMap.get(nameOrCode);
    if (byCode?.constituency === this._data.name) return byCode;

    const byName = wardNameMap.get(nameOrCode.toLowerCase());
    if (byName?.constituency === this._data.name) return byName;

    const matches = wards.filter(
      (w) =>
        w.constituency === this._data.name &&
        w.name.toLowerCase() === nameOrCode.toLowerCase()
    );

    if (matches.length === 0) {
      throw new LocationError(
        `Ward '${nameOrCode}' not found in constituency '${this._data.name}'`
      );
    }
    if (matches.length > 1) {
      throw new LocationError(
        `Multiple wards named '${nameOrCode}' found in constituency '${this._data.name}'. Use specific ward code instead.`
      );
    }
    return matches[0];
  }

  /**
   * Get the county this constituency belongs to
   */
  getCounty(): County | undefined {
    return countyNameMap.get(this._data.county.toLowerCase());
  }
}

/**
 * Get all constituencies
 * @returns Array of all constituencies
 * @example
 * ```ts
 * import { getConstituencies } from 'kenya-locations/constituencies';
 * const constituencies = getConstituencies();
 * ```
 */
export function getConstituencies(): Constituency[] {
  return constituencies;
}

/**
 * Get a constituency by code
 * @param code Constituency code
 * @returns ConstituencyWrapper instance or undefined if not found
 * @example
 * ```ts
 * import { getConstituencyByCode } from 'kenya-locations/constituencies';
 * const constituency = getConstituencyByCode('001');
 * ```
 */
export function getConstituencyByCode(
  code: string
): ConstituencyWrapper | undefined {
  const found = constituencyCodeMap.get(code);
  return found ? new ConstituencyWrapper(found) : undefined;
}

/**
 * Get a constituency by name
 * @param name Constituency name (case-insensitive)
 * @returns ConstituencyWrapper instance or undefined if not found
 * @example
 * ```ts
 * import { getConstituencyByName } from 'kenya-locations/constituencies';
 * const westlands = getConstituencyByName('Westlands');
 * ```
 */
export function getConstituencyByName(
  name: string
): ConstituencyWrapper | undefined {
  const found = constituencyNameMap.get(name.toLowerCase());
  return found ? new ConstituencyWrapper(found) : undefined;
}

/**
 * Get all wards in a constituency by name or code
 * @param constituencyNameOrCode Constituency name or code
 * @returns Array of wards in the constituency
 * @example
 * ```ts
 * import { getWardsInConstituency } from 'kenya-locations/constituencies';
 * const wards = getWardsInConstituency('Westlands');
 * ```
 */
export function getWardsInConstituency(constituencyNameOrCode: string): Ward[] {
  const byName = constituencyToWardsMap.get(constituencyNameOrCode);
  if (byName) return byName;

  const byCode = constituencyCodeMap.get(constituencyNameOrCode);
  return byCode ? (constituencyToWardsMap.get(byCode.name) ?? []) : [];
}

/**
 * Get the county that a constituency belongs to
 * @param constituencyNameOrCode Constituency name or code
 * @returns County object or undefined if not found
 * @example
 * ```ts
 * import { getCountyOfConstituency } from 'kenya-locations/constituencies';
 * const county = getCountyOfConstituency('Westlands');
 * ```
 */
export function getCountyOfConstituency(
  constituencyNameOrCode: string
): County | undefined {
  const byName = constituencyNameMap.get(constituencyNameOrCode.toLowerCase());
  if (byName) return countyNameMap.get(byName.county.toLowerCase());

  const byCode = constituencyCodeMap.get(constituencyNameOrCode);
  return byCode ? countyNameMap.get(byCode.county.toLowerCase()) : undefined;
}

// Export types
export type { Constituency };
