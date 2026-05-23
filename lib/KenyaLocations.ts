import type {
  County,
  Constituency,
  Ward,
  SearchResult,
  SubCounty,
  Area,
  Locality,
} from "./types";
import { counties } from "./data/counties";
import { constituencies } from "./data/constituencies";
import { wards } from "./data/wards";
import { subCounties } from "./data/sub-counties";
import { localities } from "./data/locality";
import { areas } from "./data/area";
import {
  search as searchFunction,
  searchByType as searchByTypeFunction,
} from "./utils/search";
import { buildLookupMap, buildGroupMap } from "./utils/maps";
import { LocationError, LocationNotFoundError } from "./errors/LocationErrors";

// --- Lookup Maps ---
const countyCodeMap = buildLookupMap(counties, (c) => c.code);
const countyNameMap = buildLookupMap(counties, (c) => c.name.toLowerCase());
const constituencyCodeMap = buildLookupMap(constituencies, (c) => c.code);
const constituencyNameMap = buildLookupMap(constituencies, (c) =>
  c.name.toLowerCase()
);
const wardCodeMap = buildLookupMap(wards, (w) => w.code);
const wardNameMap = buildLookupMap(wards, (w) => w.name.toLowerCase());
const localityNameMap = buildLookupMap(localities, (l) => l.name.toLowerCase());
const areaNameMap = buildLookupMap(areas, (a) => a.name.toLowerCase());

// --- Relationship Maps ---
const countyToConstituenciesMap = buildGroupMap(
  constituencies,
  (c) => countyNameMap.get(c.county.toLowerCase())?.code
);

// constituency code and name → county code (keyed both ways for fast lookup)
const constituencyToCountyMap: Map<string, string> = new Map(
  constituencies.flatMap((c) => {
    const code = countyNameMap.get(c.county.toLowerCase())?.code;
    return code
      ? [[c.code, code] as [string, string], [c.name, code] as [string, string]]
      : [];
  })
);

const constituencyToWardsMap = buildGroupMap(wards, (w) => w.constituency);

const countyToWardsMap = buildGroupMap(wards, (w) => {
  const constituency = constituencyNameMap.get(w.constituency.toLowerCase());
  return constituency
    ? countyNameMap.get(constituency.county.toLowerCase())?.code
    : undefined;
});

const countyToLocalitiesMap = buildGroupMap(localities, (l) => l.county);
const localityToAreasMap = buildGroupMap(areas, (a) => a.locality);
const countyToAreasMap = buildGroupMap(areas, (a) => a.county);

// Sub-county maps
const subCountyCodeMap = buildLookupMap(subCounties, (sc) => sc.code);
const subCountyNameMap = buildLookupMap(subCounties, (sc) =>
  sc.name.toLowerCase()
);
const countyToSubCountiesMap = buildGroupMap(
  subCounties,
  (sc) => countyNameMap.get(sc.county.toLowerCase())?.code
);

// --- Wrapper Classes ---

/**
 * Locality class with methods to access area data
 * @example
 *   const westlands = getLocalityByName('Westlands');
 *   westlands?.areas();
 */
class LocalityWrapper {
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
   * Get the county this locality belongs to
   * @returns CountyWrapper or undefined if not found
   */
  getCounty(): CountyWrapper | undefined {
    const county = countyNameMap.get(this._data.county.toLowerCase());
    return county ? new CountyWrapper(county) : undefined;
  }

  /**
   * Get all areas in this locality
   * @returns Array of Area
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
}

/**
 * County class with methods to access constituency, locality, and area data
 * @example
 *   const nairobi = county('Nairobi');
 *   nairobi?.constituencies();
 *   nairobi?.localities();
 */
class CountyWrapper {
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
   * @returns Array of ConstituencyWrapper
   */
  constituencies(): ConstituencyWrapper[] {
    return (countyToConstituenciesMap.get(this._data.code) ?? []).map(
      (c) => new ConstituencyWrapper(c)
    );
  }

  /**
   * Get a constituency by name or code
   * @param nameOrCode Name or code of the constituency
   * @throws LocationNotFoundError if not found
   */
  constituency(nameOrCode: string): ConstituencyWrapper {
    const byCode = constituencyCodeMap.get(nameOrCode);
    if (byCode?.county === this._data.name)
      return new ConstituencyWrapper(byCode);

    const byName = constituencyNameMap.get(nameOrCode.toLowerCase());
    if (byName?.county === this._data.name)
      return new ConstituencyWrapper(byName);

    const match = (countyToConstituenciesMap.get(this._data.code) ?? []).find(
      (c) => c.name.toLowerCase() === nameOrCode.toLowerCase()
    );
    if (match) return new ConstituencyWrapper(match);

    throw new LocationNotFoundError("Constituency", nameOrCode);
  }

  /**
   * Get all wards in this county
   * @returns Array of Ward
   */
  wards(): Ward[] {
    return countyToWardsMap.get(this._data.code) ?? [];
  }

  /**
   * Get all localities in this county
   * @returns Array of LocalityWrapper
   */
  localities(): LocalityWrapper[] {
    return (countyToLocalitiesMap.get(this._data.name) ?? []).map(
      (l) => new LocalityWrapper(l)
    );
  }

  /**
   * Get a locality by name
   * @param name Name of the locality
   * @throws LocationNotFoundError if not found
   */
  locality(name: string): LocalityWrapper {
    const found = (countyToLocalitiesMap.get(this._data.name) ?? []).find(
      (l) => l.name.toLowerCase() === name.toLowerCase()
    );
    if (found) return new LocalityWrapper(found);
    throw new LocationNotFoundError("Locality", name);
  }

  /**
   * Get all areas in this county
   * @returns Array of Area
   */
  areas(): Area[] {
    return countyToAreasMap.get(this._data.name) ?? [];
  }

  /**
   * Get areas by locality name
   * @param localityName Name of the locality
   * @returns Array of Area
   */
  areasByLocality(localityName: string): Area[] {
    return this.areas().filter(
      (a) => a.locality.toLowerCase() === localityName.toLowerCase()
    );
  }
}

/**
 * Constituency class with methods to access ward data
 * @example
 *   const westlands = getConstituencyByCode('290');
 *   westlands?.wards();
 */
class ConstituencyWrapper {
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
   * Get the county this constituency belongs to
   * @returns CountyWrapper
   */
  getCounty(): CountyWrapper | undefined {
    const county = countyNameMap.get(this._data.county.toLowerCase());
    return county ? new CountyWrapper(county) : undefined;
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
      throw new LocationNotFoundError("Ward", nameOrCode);
    }
    if (matches.length > 1) {
      throw new LocationError(
        `Multiple wards named '${nameOrCode}' found in constituency '${this._data.name}'. Use specific ward code instead.`
      );
    }
    return matches[0];
  }

  /**
   * Get all wards in this constituency
   */
  wards(): Ward[] {
    return constituencyToWardsMap.get(this._data.name) ?? [];
  }
}

// --- Standalone Functions ---

/**
 * Get all counties
 */
export function getCounties(): County[] {
  return counties;
}

/**
 * Get all sub-counties
 */
export function getSubCounties(): SubCounty[] {
  return subCounties;
}

/**
 * Get all wards
 */
export function getWards(): Ward[] {
  return wards;
}

/**
 * Get all localities
 */
export function getLocalities(): Locality[] {
  return localities;
}

/**
 * Get all areas
 */
export function getAreas(): Area[] {
  return areas;
}

/**
 * Get a county by its code
 */
export function getCountyByCode(code: string): County | undefined {
  return countyCodeMap.get(code);
}

/**
 * Get a locality by its name.
 * When the same name exists in multiple counties, returns the first match.
 * Use {@link getLocalitiesByName} to retrieve all matches, or pass a county
 * via the {@link locality} function to narrow the result.
 */
export function getLocalityByName(name: string): LocalityWrapper | undefined {
  const found = localityNameMap.get(name.toLowerCase());
  return found ? new LocalityWrapper(found) : undefined;
}

/**
 * Get all localities matching a name across all counties.
 * Useful when the same locality name exists in more than one county.
 * @param name Locality name (case-insensitive)
 * @returns Array of LocalityWrapper instances
 */
export function getLocalitiesByName(name: string): LocalityWrapper[] {
  return localities
    .filter((l) => l.name.toLowerCase() === name.toLowerCase())
    .map((l) => new LocalityWrapper(l));
}

/**
 * Get an area by its name
 */
export function getAreaByName(name: string): Area | undefined {
  return areaNameMap.get(name.toLowerCase());
}

/**
 * Get all localities in a county
 * @param countyName County name
 */
export function getLocalitiesInCounty(countyName: string): Locality[] {
  return countyToLocalitiesMap.get(countyName) ?? [];
}

/**
 * Get all areas in a locality
 * @param localityName Locality name
 */
export function getAreasInLocality(localityName: string): Area[] {
  return localityToAreasMap.get(localityName) ?? [];
}

/**
 * Get all areas in a county
 * @param countyName County name
 */
export function getAreasInCounty(countyName: string): Area[] {
  return countyToAreasMap.get(countyName) ?? [];
}

/**
 * Get the county of a locality
 * @param localityName The name of the locality
 */
export function getCountyOfLocality(localityName: string): County | undefined {
  const locality = localityNameMap.get(localityName.toLowerCase());
  if (!locality) return undefined;
  return countyNameMap.get(locality.county.toLowerCase());
}

/**
 * Get the county of an area
 * @param areaName The name of the area
 */
export function getCountyOfArea(areaName: string): County | undefined {
  const area = areaNameMap.get(areaName.toLowerCase());
  if (!area) return undefined;
  return countyNameMap.get(area.county.toLowerCase());
}

/**
 * Get the locality of an area
 * @param areaName The name of the area
 */
export function getLocalityOfArea(areaName: string): Locality | undefined {
  const area = areaNameMap.get(areaName.toLowerCase());
  if (!area) return undefined;
  return localityNameMap.get(area.locality.toLowerCase());
}

/**
 * Get all sub-counties in a county
 * @param nameOrCode County name or code
 */
export function getSubCountiesInCounty(nameOrCode: string): SubCounty[] {
  const county =
    countyCodeMap.get(nameOrCode) ??
    countyNameMap.get(nameOrCode.toLowerCase());
  if (!county) return [];
  return countyToSubCountiesMap.get(county.code) ?? [];
}

/**
 * Get all wards in a sub-county by name or code.
 * Sub-county names correspond to constituency names in the ward dataset,
 * so this matches wards whose constituency field equals the sub-county name.
 * @param nameOrCode Sub-county name or code
 */
export function getWardsInSubCounty(nameOrCode: string): Ward[] {
  const sc =
    subCountyCodeMap.get(nameOrCode) ??
    subCountyNameMap.get(nameOrCode.toLowerCase());
  if (!sc) return [];
  return wards.filter(
    (w) => w.constituency.toLowerCase() === sc.name.toLowerCase()
  );
}

/**
 * Get the county of a sub-county
 * @param subCountyName The name of the sub-county
 */
export function getCountyOfSubCounty(
  subCountyName: string
): County | undefined {
  const sc = subCountyNameMap.get(subCountyName.toLowerCase());
  return sc ? countyNameMap.get(sc.county.toLowerCase()) : undefined;
}

/**
 * Get the county that a ward belongs to by ward name or code
 */
export function getCountyOfWard(wardNameOrCode: string): County | undefined {
  const ward =
    wardCodeMap.get(wardNameOrCode) ??
    wardNameMap.get(wardNameOrCode.toLowerCase());
  if (!ward) return undefined;

  const countyCode = constituencyToCountyMap.get(ward.constituency);
  return countyCode ? countyCodeMap.get(countyCode) : undefined;
}

/**
 * Get a county by name or code
 */
export function county(nameOrCode: string): CountyWrapper | undefined {
  const found =
    countyCodeMap.get(nameOrCode) ??
    countyNameMap.get(nameOrCode.toLowerCase());
  return found ? new CountyWrapper(found) : undefined;
}

/**
 * Get a locality by name or county
 */
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

/**
 * Get all constituencies
 */
export function getConstituencies(): Constituency[] {
  return constituencies;
}

/**
 * Get a constituency by code
 */
export function getConstituencyByCode(
  code: string
): ConstituencyWrapper | undefined {
  const found = constituencyCodeMap.get(code);
  return found ? new ConstituencyWrapper(found) : undefined;
}

/**
 * Get all wards in a county
 */
export function getWardsInCounty(countyNameOrCode: string): Ward[] {
  if (countyToWardsMap.has(countyNameOrCode)) {
    return countyToWardsMap.get(countyNameOrCode) ?? [];
  }
  const county = countyNameMap.get(countyNameOrCode.toLowerCase());
  return county ? (countyToWardsMap.get(county.code) ?? []) : [];
}

/**
 * Search for counties, constituencies, wards, localities, or areas
 */
export function search(
  query: string,
  options: {
    limit?: number;
    types?: (
      | "county"
      | "constituency"
      | "ward"
      | "sub-county"
      | "locality"
      | "area"
    )[];
  } = {}
): SearchResult[] {
  return searchFunction(query, options);
}

/**
 * Search for a specific type of administrative division
 */
export function searchByType(
  query: string,
  type: "county" | "constituency" | "ward" | "sub-county" | "locality" | "area",
  limit?: number
): SearchResult[] {
  return searchByTypeFunction(query, type, limit);
}

/**
 * Get all wards in a constituency by name or code
 */
export function getWardsInConstituency(constituencyNameOrCode: string): Ward[] {
  const byName = constituencyToWardsMap.get(constituencyNameOrCode);
  if (byName) return byName;

  const byCode = constituencyCodeMap.get(constituencyNameOrCode);
  return byCode ? (constituencyToWardsMap.get(byCode.name) ?? []) : [];
}

/**
 * Get the county that a constituency belongs to
 */
export function getCountyOfConstituency(
  constituencyNameOrCode: string
): County | undefined {
  const byName = constituencyNameMap.get(constituencyNameOrCode.toLowerCase());
  if (byName) return countyNameMap.get(byName.county.toLowerCase());

  const byCode = constituencyCodeMap.get(constituencyNameOrCode);
  return byCode ? countyNameMap.get(byCode.county.toLowerCase()) : undefined;
}

/**
 * Main class for working with Kenya's administrative locations.
 *
 * @deprecated Use the tree-shakeable standalone functions instead.
 * Import directly from `kenya-locations` or its subpath exports
 * (e.g. `kenya-locations/counties`, `kenya-locations/wards`).
 * The class will be removed in a future major version.
 */
export class KenyaLocations {
  private static instance: KenyaLocations;

  /**
   * Get the singleton instance of KenyaLocations
   */
  public static getInstance(): KenyaLocations {
    if (!KenyaLocations.instance) {
      KenyaLocations.instance = new KenyaLocations();
    }
    return KenyaLocations.instance;
  }

  public static getCounties = getCounties;
  public static getSubCounties = getSubCounties;
  public static getWards = getWards;
  public static getLocalities = getLocalities;
  public static getAreas = getAreas;
  public static getCountyByCode = getCountyByCode;
  public static getLocalityByName = getLocalityByName;
  public static getLocalitiesByName = getLocalitiesByName;
  public static getAreaByName = getAreaByName;
  public static getLocalitiesInCounty = getLocalitiesInCounty;
  public static getAreasInLocality = getAreasInLocality;
  public static getAreasInCounty = getAreasInCounty;
  public static getCountyOfLocality = getCountyOfLocality;
  public static getCountyOfArea = getCountyOfArea;
  public static getLocalityOfArea = getLocalityOfArea;
  public static getSubCountiesInCounty = getSubCountiesInCounty;
  public static getWardsInSubCounty = getWardsInSubCounty;
  public static getCountyOfSubCounty = getCountyOfSubCounty;
  public static getCountyOfWard = getCountyOfWard;
  public static county = county;
  public static locality = locality;
  public static getConstituencies = getConstituencies;
  public static getConstituencyByCode = getConstituencyByCode;
  public static getWardsInCounty = getWardsInCounty;
  public static search = search;
  public static searchByType = searchByType;
  public static getWardsInConstituency = getWardsInConstituency;
  public static getCountyOfConstituency = getCountyOfConstituency;
}

export { CountyWrapper, ConstituencyWrapper, LocalityWrapper };

// Backward-compatible error aliases
export {
  LocationError as KenyaLocationsError,
  LocationNotFoundError as NotFoundError,
};

export default KenyaLocations;
