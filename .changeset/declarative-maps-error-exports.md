---
"kenya-locations": minor
---

Refactor internal map construction to use shared declarative utilities, unify the error hierarchy,
and export the full error class tree from the main package entry point.

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
- Removed duplicate `Area` / `Locality` interface definitions from data files — `types/index.ts` is
  the single source of truth for all entity shapes
- Removed duplicate `SearchType` definition from `utils/search.ts`
- `Fuse<any>` replaced with proper generic types in the search utility
- Deleted unused `data-structures/Trie.ts`
- Test suite split into per-module files for faster, clearer failures
