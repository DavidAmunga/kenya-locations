# Changelog

## 0.5.0

### Minor Changes

- [#18](https://github.com/davidamunga/kenya-locations/pull/18)
  [`9763e06`](https://github.com/davidamunga/kenya-locations/commit/9763e0691e172208215d9a0ea1a8fdd3ce9270f1)
  Thanks [@davidamunga](https://github.com/davidamunga)! - Wire `kenya-locations/version` subpath
  export, auto-derive `DATA_VERSION`, deprecate `KenyaLocations` class.

  **New subpath export**

  `kenya-locations/version` is now a first-class subpath export (it was documented in the v0.4.0
  changelog but the entry was missing from `package.json`):

  ```ts
  import { DATA_VERSION } from "kenya-locations/version";
  ```

  **`DATA_VERSION` no longer drifts**

  `DATA_VERSION` is now derived directly from `package.json` instead of being a manually-maintained
  string. It will always match the published npm version — no more stale values after a release.

  **`KenyaLocations` class deprecated**

  `KenyaLocations` is now marked `@deprecated`. The tree-shakeable standalone functions (importable
  from `kenya-locations` or its subpaths) are the recommended API. The class will be removed in a
  future major version.

  **Housekeeping**

  Removed the empty `src/vite-env.d.ts` Vite template stub.

## 0.4.0

### Minor Changes

- [#16](https://github.com/davidamunga/kenya-locations/pull/16)
  [`5592bcd`](https://github.com/davidamunga/kenya-locations/commit/5592bcddbbfde1f6daa4920cf6cdbb41376ee976)
  Thanks [@davidamunga](https://github.com/davidamunga)! - Fix `getWardsInSubCounty`, add
  `getLocalitiesByName`, expand `CountyWrapper` API, expose `DATA_VERSION`, and migrate data to
  JSON.

  **Bug fixes**

  - `getWardsInSubCounty(nameOrCode)` was completely broken — it compared a ward's `constituency`
    name field against a sub-county numeric code, always returning an empty array. It now resolves
    the sub-county by code **or** name first, then matches wards whose `constituency` equals the
    sub-county name (sub-county names correspond to constituency names in the dataset). Both
    `kenya-locations` and `kenya-locations/sub-counties` are fixed.
  - `getSubCountiesInCounty` in the main module now uses county code as the map key (matching the
    `sub-counties` subpath module) — inconsistency that could cause drift is resolved.

  **New API**

  - `getLocalitiesByName(name)` — returns **all** localities matching a name across every county.
    The existing `getLocalityByName` returns only the first match when a name is duplicated across
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

  - All six data arrays (`counties`, `constituencies`, `wards`, `sub-counties`, `localities`,
    `areas`) are now stored as JSON source files (`lib/data/*.json`). The TypeScript files become
    4-line typed wrappers (`import raw from "./x.json"; export const x: X[] = raw`). The public API
    is completely unchanged.
  - `pnpm validate` no longer requires a prior `pnpm build` — it reads the JSON files directly. CI
    now runs validation **before** the build step.
  - `pnpm validate` gained a new **required-fields check** that catches entries with missing or
    empty `code`, `name`, `county`, `constituency`, or `locality` fields.
  - Pre-commit data hook (`lint-staged`) updated to trigger on `lib/data/*.json` changes instead of
    `*.ts`.

  **Tooling**

  - Added `@vitest/coverage-v8` — `pnpm test:coverage` now produces a full coverage report (94%
    statements, 88% branches). CI runs coverage instead of plain `pnpm test`.
  - `fuse.js` marked as external in Vite config — no longer bundled into each output chunk;
    consumers share one copy.
  - Pre-commit hook changed from `npm test` to `pnpm test` (project uses pnpm throughout).
  - `KenyaDivisionsOptions` interface marked `@deprecated` (was unused; use `DATA_VERSION` instead).

## 0.3.0

### Minor Changes

- [#15](https://github.com/davidamunga/kenya-locations/pull/15)
  [`196a243`](https://github.com/davidamunga/kenya-locations/commit/196a243b7cba6200e2ac88f6d6e9fcda238b8f94)
  Thanks [@davidamunga](https://github.com/davidamunga)! - Refactor internal map construction to use
  shared declarative utilities, unify the error hierarchy, and export the full error class tree from
  the main package entry point.

  **New exports** — all error classes are now importable from `"kenya-locations"`:

  ```ts
  import {
    LocationError,
    LocationNotFoundError,
    InvalidLocationCodeError,
    SearchError,
    DataValidationError,
    ConfigurationError,
  } from "kenya-locations";
  ```

  **Internal improvements (no API changes):**

  - `buildLookupMap` / `buildGroupMap` utilities replace all imperative `forEach` + `push`
    map-building blocks across every module
  - `KenyaLocations.ts` now imports errors from `errors/LocationErrors.ts`; `NotFoundError` and
    `KenyaLocationsError` remain exported as backward-compatible aliases
  - Removed duplicate `Area` / `Locality` interface definitions from data files — `types/index.ts`
    is the single source of truth for all entity shapes
  - Removed duplicate `SearchType` definition from `utils/search.ts`
  - `Fuse<any>` replaced with proper generic types in the search utility
  - Deleted unused `data-structures/Trie.ts`
  - Test suite split into per-module files for faster, clearer failures

### Patch Changes

- [`2cfaa94`](https://github.com/davidamunga/kenya-locations/commit/2cfaa943d0649386b36f24b71e9c5ca4cca76cc5)
  Thanks [@davidamunga](https://github.com/davidamunga)! - chore: improve release workflow

## 0.2.0

### Minor Changes

- cbd79cd: Add automated versioning and release.

All notable changes to the Kenya Locations package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8]

### Fixed

- Constituency & Wards Data

## [0.1.7]

### Fixed

- Remove Duplicate Localities

## [0.1.6]

### NEW

- data (garissa, homa bay, isiolo, kakamega, nyandarua, taita-taveta): added new areas and updated
  localities

### Fixed

- Fixed Validation Script
- Sorted Localities and Areas

## [0.1.5]

### Fixed

- fix(build): resolve ES module compatibility issue with CJS output

## [0.1.4]

### Fixed

- Added areas (Nairobi, Nakuru, Machakos, Kisumu and Machakos)

## [0.1.3]

### Fixed

- Changed `Constituency` interface: `county: County` → `county: string`
- Updated all 290 constituency entries to use county names instead of county objects

## [0.1.2]

### Fixed

- Updated area+locality sets (removed areas with estate)
- Removed searching by codes and other fields
- Improved search performance by lazy init fuse instances when needed.
- Added `searchByType` function to search for specific types of administrative divisions
- Added `search` function options to customize search results e.g. `limit`, `types`
- Added validatation scripts
- Added pre-commit hooks
-

## [0.1.1]

### Fixed

- Fixed county hierarchy example in examples/basic-usage.html
- Fixed ward hierarchy example in examples/basic-usage.html
- Corrected constituency → county reference data in `lib/data/constituencies.ts`

## [0.1.0]

### Added

- **NEW**: Complete localities and areas functionality
  - Added `Locality` and `Area` interfaces and data types
  - Added 880+ localities across all 47 counties
  - Added 670+ areas linked to their respective localities
  - New functions: `getLocalities()`, `getAreas()`, `getLocalityByName()`, `getAreaByName()`
  - New functions: `getLocalitiesInCounty()`, `getAreasInLocality()`, `getAreasInCounty()`
  - New relationship functions: `getCountyOfLocality()`, `getCountyOfArea()`, `getLocalityOfArea()`
  - Added `LocalityWrapper` class with methods to navigate locality data and relationships
  - Enhanced search functionality to include localities and areas in search results
  - Extended `CountyWrapper` class with `localities()`, `locality()`, `areas()`, and
    `areasByLocality()` methods

### Changed

- Updated search results to include "locality" and "area" types
- Enhanced the `SearchResult` interface to support new data types
- Updated examples and documentation for new functionality

## [0.0.4]

### Changed

- **BREAKING**: Renamed functions to remove "all" prefix:
  - `getAllCounties()` → `getCounties()`
  - `getAllSubCounties()` → `getSubCounties()`
  - `getAllWards()` → `getWards()`
  - `getAllConstituencies()` → `getConstituencies()`
  - `getAllWardsInCounty()` → `getWardsInCounty()`
- Updated all tests to use new function names
- Updated `Constituency` interface to use `county` object instead of `countyCode` string
- Updated constituency data structure to reference county objects directly
- Updated ConstituencyWrapper class with `getCounty()` method instead of `county()`
- Updated internal relationship maps and search utilities to support new constituency structure

### Fixed

- Fixed `getSubCountiesInCounty` to properly handle both county codes and names
- Improved sub-county lookup performance by using county maps

## [0.0.3]

### Added

- Comprehensive test suite for all functionality
- Test coverage for sub-counties and related functions
- Vitest setup for running tests
- Testing badges in README

### Changed

- **BREAKING**: Updated `SubCounty` interface to use `county` (name) instead of `countyCode`
- Updated sub-counties data structure to use county names directly
- Updated internal relationship maps to support new sub-county structure
- Enhanced README with sub-county functionality documentation
- Improved the implementation of `getSubCountiesInCounty` and `getCountyOfSubCounty` functions

### Fixed

- Fixed imports in test files

## [0.0.2]

Fixed Docs

## [0.0.1]

Initial public release.
