---
"kenya-locations": minor
"kenya-locations-react": minor
---

### kenya-locations

- **County metadata** — every `County` now carries `capital`, `area_km2`, `population_2019`, `region` (former province), and `postal_code` sourced from KNBS
- **`SearchResult` discriminated union** — TypeScript narrows `item` automatically by `type` (`"county" | "constituency" | "ward" | "sub-county" | "locality" | "area"`)
- **New standalone functions** — `getCountyByName`, `getConstituenciesInCounty`, `getConstituencyOfWard`, `getSubCountyOfWard`, `getAreasByName`
- **Root barrel exports** — `subCounties`, `localities`, `areas` raw arrays now exported from the root entry point
- **`CountyWrapper` consistency fix** — wrapper methods now return `CountyWrapper` instances consistently
- **Type declarations path fixed** — `dist/index.d.ts` now resolves correctly via `vite-plugin-dts` `entryRoot` config
- **Cross-platform fuzzy search** — Kotlin and Swift now ship a native Levenshtein sliding-window implementation with full parity to the JS Fuse.js results; no external dependencies added

### kenya-locations-react — initial release

React hooks for every level of the Kenya locations hierarchy, all memoised for stable references:

- `useCounties()`, `useCounty(nameOrCode)`
- `useConstituencies()`, `useConstituenciesInCounty(nameOrCode)`, `useConstituency(codeOrName)`
- `useWards()`, `useWardsInCounty()`, `useWardsInConstituency()`, `useConstituencyOfWard()`, `useSubCountyOfWard()`
- `useSubCounties()`, `useSubCountiesInCounty()`
- `useLocalities()`, `useLocalitiesInCounty()`, `useLocality()`
- `useAreas()`, `useAreasInLocality()`, `useAreasInCounty()`
- `useSearch(query, { limit?, types?, debounceMs? })` — debounced fuzzy search returning `{ results: SearchResult[], isPending: boolean }`
