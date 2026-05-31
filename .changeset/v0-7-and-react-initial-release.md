---
"kenya-locations": minor
"kenya-locations-react": minor
---

**kenya-locations v0.7.0**

- Enriched `County` type with `capital`, `area_km2`, `population_2019`, `region`, and `postal_code` fields across all 47 counties
- Added `SearchResult` discriminated union (`{ type: "county" | "constituency" | ... ; item: ... }`) for type-safe result handling
- New standalone API functions: `getCountyByName`, `getConstituenciesInCounty`, `getConstituencyOfWard`, `getSubCountyOfWard`, `getAreasByName`
- Root barrel now exports raw data arrays: `subCounties`, `localities`, `areas`
- Fixed `CountyWrapper` methods to consistently return `CountyWrapper` instances
- Fixed type declaration output path (`dist/index.d.ts`) via `vite-plugin-dts` config
- Native fuzzy search (Levenshtein sliding-window) in Kotlin and Swift — no external dependencies, full cross-platform parity with the JS Fuse.js implementation

**kenya-locations-react v0.1.0 — initial release**

React hooks for every entity in the kenya-locations dataset:

- `useCounties()` — all counties
- `useCounty(code)` — single county wrapper
- `useSubCounties(countyCode?)` — sub-counties, optionally filtered by county
- `useConstituencies(countyCode?)` — constituencies, optionally filtered by county
- `useWards(subCountyCode?, constituencyCode?)` — wards with optional filters
- `useLocalities(subCountyCode?)` — localities, optionally filtered by sub-county
- `useAreas(localityCode?)` — areas, optionally filtered by locality
- `useSearch(query, options?)` — debounced search returning typed `SearchResult[]` with `isPending` state
