import Fuse from "fuse.js";
import type {
  SearchResult,
  SearchType,
  County,
  Constituency,
  Ward,
  SubCounty,
  Locality,
  Area,
} from "../types";
import { counties, constituencies, wards } from "../data";
import { subCounties } from "../data/sub-counties";
import { areas } from "../data/area";
import { localities } from "../data/locality";

/**
 * Configuration for Fuse.js fuzzy search - optimized for name-only search
 * Threshold of 0.2 provides better precision when searching localities and areas while still allowing for typos
 */
const searchOptions = {
  keys: ["name"],
  threshold: 0.2,
  includeScore: true,
  ignoreLocation: true, // Performance optimization
  findAllMatches: false, // Performance optimization
  minMatchCharLength: 2, // Performance optimization
};

/**
 * Lazy-initialized Fuse instances for better performance
 */
let countyFuse: Fuse<County> | null = null;
let constituencyFuse: Fuse<Constituency> | null = null;
let wardFuse: Fuse<Ward> | null = null;
let subCountyFuse: Fuse<SubCounty> | null = null;
let localityFuse: Fuse<Locality> | null = null;
let areaFuse: Fuse<Area> | null = null;

/**
 * Initialize Fuse instances only when needed
 */
function initializeFuseInstances() {
  countyFuse ??= new Fuse(counties, searchOptions);
  constituencyFuse ??= new Fuse(constituencies, searchOptions);
  wardFuse ??= new Fuse(wards, searchOptions);
  subCountyFuse ??= new Fuse(subCounties, searchOptions);
  localityFuse ??= new Fuse(localities, searchOptions);
  areaFuse ??= new Fuse(areas, searchOptions);
}

/**
 * Search across all levels of administrative divisions
 * @param query Search query string
 * @param options Search options
 * @param options.limit Maximum number of results (default: 10)
 * @param options.types Specific types to search (optional, searches all if not provided)
 * @returns Array of search results sorted by relevance and type hierarchy
 */
export function search(
  query: string,
  options: {
    limit?: number;
    types?: SearchType[];
  } = {}
): SearchResult[] {
  const { limit = 10, types } = options;

  // Don't perform search if query is too short
  if (!query || query.trim().length < 2) {
    return [];
  }

  // Initialize Fuse instances
  initializeFuseInstances();

  const trimmedQuery = query.trim();
  type ScoredResult = SearchResult & { score?: number };
  const results: ScoredResult[] = [];

  // Define search functions with type guards
  const searchFunctions = [
    {
      type: "county" as const,
      fuse: countyFuse!,
      enabled: !types || types.includes("county"),
    },
    {
      type: "constituency" as const,
      fuse: constituencyFuse!,
      enabled: !types || types.includes("constituency"),
    },
    {
      type: "ward" as const,
      fuse: wardFuse!,
      enabled: !types || types.includes("ward"),
    },
    {
      type: "sub-county" as const,
      fuse: subCountyFuse!,
      enabled: !types || types.includes("sub-county"),
    },
    {
      type: "locality" as const,
      fuse: localityFuse!,
      enabled: !types || types.includes("locality"),
    },
    {
      type: "area" as const,
      fuse: areaFuse!,
      enabled: !types || types.includes("area"),
    },
  ];

  // Perform searches only for enabled types
  for (const { type, fuse, enabled } of searchFunctions) {
    if (enabled) {
      const searchResults = fuse.search(trimmedQuery, { limit: limit * 2 }); // Get more results for better sorting
      results.push(
        ...searchResults.map(
          (result) =>
            ({
              type,
              item: result.item,
              score: result.score,
            }) as ScoredResult
        )
      );
    }
  }

  // Sort by score first (lower is better), then by type hierarchy
  const typeOrder = {
    county: 1,
    constituency: 2,
    ward: 3,
    "sub-county": 4,
    locality: 5,
    area: 6,
  };

  return (
    results
      .sort((a, b) => {
        // Primary sort: by score (lower score = better match)
        if (a.score !== b.score) {
          return (a.score || 0) - (b.score || 0);
        }
        // Secondary sort: by type hierarchy
        return typeOrder[a.type] - typeOrder[b.type];
      })
      .slice(0, limit)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ score, ...result }) => result)
  );
}

/**
 * Search for a specific type only
 * @param query Search query string
 * @param type The specific type to search for
 * @param limit Maximum number of results (default: 10)
 * @returns Array of search results for the specified type
 */
export function searchByType(
  query: string,
  type: SearchType,
  limit = 10
): SearchResult[] {
  return search(query, { limit, types: [type] });
}
