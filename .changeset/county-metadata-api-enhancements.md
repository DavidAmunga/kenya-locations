---
"kenya-locations": minor
---

## County metadata enrichment

Every county object now ships five additional fields sourced from KNBS:

- `capital` — county headquarters / main town
- `area_km2` — land area in square kilometres
- `population_2019` — population from the 2019 Kenya Population and Housing Census
- `region` — former province (`CountyRegion` union type: `"Nairobi" | "Central" | "Coast" | "Eastern" | "North Eastern" | "Nyanza" | "Rift Valley" | "Western"`)
- `postal_code` — Kenya Post primary postal code for the county capital

Kotlin `County` data class and Swift `County` struct updated to match; a `CountyRegion` enum added to both.

## TypeScript: `SearchResult` discriminated union

`SearchResult` is now a proper discriminated union instead of an intersection type. TypeScript narrows `item` automatically when you branch on `type`:

```ts
for (const r of search("Nairobi")) {
  if (r.type === "county")       console.log(r.item.capital);      // County
  else if (r.type === "ward")    console.log(r.item.constituency); // Ward
  else if (r.type === "area")    console.log(r.item.locality);     // Area
}
```

## New standalone API functions

Tree-shakeable functions added to the root barrel (`kenya-locations`):

| Function | Description |
|---|---|
| `getCountyByName(name)` | Look up a county by exact name |
| `getConstituencyByName(name)` | Look up a constituency by exact name |
| `getConstituenciesInCounty(nameOrCode)` | All constituencies in a county as `ConstituencyWrapper[]` |
| `getWardByCode(code)` | Look up a ward by code |
| `getWardByName(name)` | Look up a ward by name |
| `getSubCountyByCode(code)` | Look up a sub-county by code |
| `getSubCountyByName(name)` | Look up a sub-county by name |
| `getConstituencyOfWard(nameOrCode)` | Resolve a ward → parent `ConstituencyWrapper` |
| `getSubCountyOfWard(nameOrCode)` | Resolve a ward → parent `SubCounty` |
| `getAreasByName(name)` | All areas matching a name (handles duplicates across localities) |

## New root barrel exports

`subCounties`, `localities`, and `areas` raw data arrays are now exported directly from the root `kenya-locations` import (previously only accessible via subpath modules).

## `CountyWrapper` consistency fix

`CountyWrapper.constituencies()` and `CountyWrapper.constituency()` accessed via the `kenya-locations/counties` subpath now return `ConstituencyWrapper` instances (matching the behaviour of the main import). Previously they returned plain data objects.

## Build: type declarations path fixed

`vite-plugin-dts` now uses `entryRoot: "lib"` so declaration files land at `dist/index.d.ts` (and siblings) instead of the incorrect `dist/packages/js/lib/…` path that was shipped in prior versions.

## Data validation script updated

`scripts/validate-data.js` enforces presence of all new county fields and validates `region` against the allowed `CountyRegion` values.

## Cross-platform fuzzy search (Kotlin & Swift)

Both platforms now implement the same Levenshtein sliding-window algorithm used in the JS package, replacing the previous plain substring match. Queries like `"Nairob"` now match `"Nairobi"` across all three platforms.

The implementation is self-contained (zero new runtime dependencies). The effective threshold mirrors Fuse.js at ≈ 0.4: a pattern of length *n* matches if the best sliding window has at most `floor(n × 0.4)` character errors. Results are returned sorted by relevance score, best match first.
