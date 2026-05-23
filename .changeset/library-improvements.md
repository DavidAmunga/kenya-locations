---
"kenya-locations": minor
---

Fix `getWardsInSubCounty`, add `getLocalitiesByName`, expand `CountyWrapper` API, expose
`DATA_VERSION`, and migrate data to JSON.

**Bug fixes**

- `getWardsInSubCounty(nameOrCode)` was completely broken — it compared a ward's `constituency` name
  field against a sub-county numeric code, always returning an empty array. It now resolves the
  sub-county by code **or** name first, then matches wards whose `constituency` equals the
  sub-county name (sub-county names correspond to constituency names in the dataset). Both
  `kenya-locations` and `kenya-locations/sub-counties` are fixed.
- `getSubCountiesInCounty` in the main module now uses county code as the map key (matching the
  `sub-counties` subpath module) — inconsistency that could cause drift is resolved.

**New API**

- `getLocalitiesByName(name)` — returns **all** localities matching a name across every county. The
  existing `getLocalityByName` returns only the first match when a name is duplicated across
  counties; this new function lets callers handle that case explicitly. Available from both
  `kenya-locations` and `kenya-locations/localities`.
- `CountyWrapper.constituency(nameOrCode)` and `CountyWrapper.locality(name)` — the tree-shakeable
  `kenya-locations/counties` subpath `CountyWrapper` was missing these single-item lookup methods
  (with `LocationNotFoundError` on miss) that the main module's wrapper already had. Both subpaths
  now have a consistent API.
- `DATA_VERSION` string constant — exported from `kenya-locations`. Consumers can read the current
  dataset version at runtime. Also available as
  `import { DATA_VERSION } from 'kenya-locations/version'` (new subpath not yet wired in
  package.json, constant lives in `lib/version.ts`).

**Data**

- All six data arrays (`counties`, `constituencies`, `wards`, `sub-counties`, `localities`, `areas`)
  are now stored as JSON source files (`lib/data/*.json`). The TypeScript files become 4-line typed
  wrappers (`import raw from "./x.json"; export const x: X[] = raw`). The public API is completely
  unchanged.
- `pnpm validate` no longer requires a prior `pnpm build` — it reads the JSON files directly. CI now
  runs validation **before** the build step.
- `pnpm validate` gained a new **required-fields check** that catches entries with missing or empty
  `code`, `name`, `county`, `constituency`, or `locality` fields.
- Pre-commit data hook (`lint-staged`) updated to trigger on `lib/data/*.json` changes instead of
  `*.ts`.

**Tooling**

- Added `@vitest/coverage-v8` — `pnpm test:coverage` now produces a full coverage report (94%
  statements, 88% branches). CI runs coverage instead of plain `pnpm test`.
- `fuse.js` marked as external in Vite config — no longer bundled into each output chunk; consumers
  share one copy.
- Pre-commit hook changed from `npm test` to `pnpm test` (project uses pnpm throughout).
- `KenyaDivisionsOptions` interface marked `@deprecated` (was unused; use `DATA_VERSION` instead).
