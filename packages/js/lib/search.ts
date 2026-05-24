/**
 * Tree-shakeable exports for search functionality
 */

import type { SearchResult, SearchType } from "./types";
import {
  search as searchFunction,
  searchByType as searchByTypeFunction,
} from "./utils/search";

/**
 * Search options interface
 */
export interface SearchOptions {
  /** Maximum number of results to return */
  limit?: number;
  /** Types of locations to search */
  types?: SearchType[];
}

/**
 * Search for counties, constituencies, wards, localities, or areas
 * @param query Search query string
 * @param options Search options (limit and types)
 * @returns Array of search results
 * @example
 * ```ts
 * import { search } from 'kenya-locations/search';
 *
 * // Search all types
 * const results = search('Nairobi');
 *
 * // Search with limit
 * const limited = search('Nairobi', { limit: 5 });
 *
 * // Search specific types
 * const counties = search('Nairobi', { types: ['county'] });
 *
 * // Combine options
 * const results = search('West', { limit: 10, types: ['locality', 'area'] });
 * ```
 */
export function search(
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  return searchFunction(query, options);
}

/**
 * Search for a specific type of administrative division
 * @param query Search query string
 * @param type Type of location to search for
 * @param limit Maximum number of results (optional)
 * @returns Array of search results
 * @example
 * ```ts
 * import { searchByType } from 'kenya-locations/search';
 *
 * const counties = searchByType('Nairob', 'county', 5);
 * const localities = searchByType('West', 'locality', 10);
 * ```
 */
export function searchByType(
  query: string,
  type: SearchType,
  limit?: number
): SearchResult[] {
  return searchByTypeFunction(query, type, limit);
}

// Export types
export type { SearchResult, SearchType };
