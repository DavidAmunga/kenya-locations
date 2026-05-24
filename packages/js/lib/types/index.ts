/**
 * Interface for County data
 */
export interface County {
  code: string;
  name: string;
}

/**
 * Interface for SubCounty data
 */
export interface SubCounty {
  code: string;
  name: string;
  county: string;
}

/**
 * Interface for Constituency data
 */
export interface Constituency {
  code: string;
  name: string;
  county: string;
}

/**
 * Interface for Ward data
 */
export interface Ward {
  code: string;
  name: string;
  constituency: string;
}

/**
 * Interface for Locality data
 */
export interface Locality {
  name: string;
  county: string;
}

/**
 * Interface for Area data
 */
export interface Area {
  name: string;
  locality: string;
  county: string;
}

/**
 * Search result interface
 */
export interface SearchResult {
  type: "county" | "constituency" | "ward" | "sub-county" | "locality" | "area";
  item: County | Constituency | Ward | SubCounty | Locality | Area;
}

/**
 * Available search types
 */
export type SearchType =
  | "county"
  | "constituency"
  | "ward"
  | "sub-county"
  | "locality"
  | "area";

/**
 * @deprecated This interface is unused. Use {@link DATA_VERSION} to read the
 * current data version at runtime.
 */
export interface KenyaDivisionsOptions {
  dataVersion?: string;
}
