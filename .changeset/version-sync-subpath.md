---
"kenya-locations": minor
---

Wire `kenya-locations/version` subpath export, auto-derive `DATA_VERSION`, deprecate
`KenyaLocations` class.

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
