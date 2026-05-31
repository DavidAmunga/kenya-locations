# kenya-locations-react

## 0.2.0

### Minor Changes

- [#24](https://github.com/davidamunga/kenya-locations/pull/24)
  [`41cf80b`](https://github.com/davidamunga/kenya-locations/commit/41cf80bafc334ddb52daa5c85d570735955e11f1)
  Thanks [@davidamunga](https://github.com/davidamunga)! - ## Initial release of
  `kenya-locations-react`

  New companion package providing memoised React hooks for every level of Kenya's administrative
  hierarchy, with built-in debouncing for search.

  ### Install

  ```bash
  npm install kenya-locations-react
  ```

  Requires `react >= 18` and `kenya-locations` as a peer.

  ### Hooks

  | Hook                                    | Returns                                           | Description                                        |
  | --------------------------------------- | ------------------------------------------------- | -------------------------------------------------- |
  | `useCounties()`                         | `County[]`                                        | All 47 counties (stable reference)                 |
  | `useCounty(nameOrCode)`                 | `CountyWrapper \| undefined`                      | Single county wrapper                              |
  | `useConstituencies()`                   | `Constituency[]`                                  | All 290 constituencies                             |
  | `useConstituency(codeOrName)`           | `ConstituencyWrapper \| undefined`                | Single constituency                                |
  | `useConstituenciesInCounty(nameOrCode)` | `ConstituencyWrapper[]`                           | Constituencies in a county                         |
  | `useWards()`                            | `Ward[]`                                          | All 1,448 wards                                    |
  | `useWardsInCounty(nameOrCode)`          | `Ward[]`                                          | Wards in a county                                  |
  | `useWardsInConstituency(nameOrCode)`    | `Ward[]`                                          | Wards in a constituency                            |
  | `useConstituencyOfWard(nameOrCode)`     | `ConstituencyWrapper \| undefined`                | Parent constituency of a ward                      |
  | `useSubCountyOfWard(nameOrCode)`        | `SubCounty \| undefined`                          | Parent sub-county of a ward                        |
  | `useSubCounties()`                      | `SubCounty[]`                                     | All 307 sub-counties                               |
  | `useSubCountiesInCounty(nameOrCode)`    | `SubCounty[]`                                     | Sub-counties in a county                           |
  | `useLocalities()`                       | `Locality[]`                                      | All 916 localities                                 |
  | `useLocalitiesInCounty(countyName)`     | `Locality[]`                                      | Localities in a county                             |
  | `useLocality(name, countyName?)`        | `LocalityWrapper \| undefined`                    | Single locality (county-scoped for disambiguation) |
  | `useAreas()`                            | `Area[]`                                          | All 1,829 areas                                    |
  | `useAreasInLocality(localityName)`      | `Area[]`                                          | Areas in a locality                                |
  | `useAreasInCounty(countyName)`          | `Area[]`                                          | Areas in a county                                  |
  | `useSearch(query, options?)`            | `{ results: SearchResult[], isPending: boolean }` | Debounced fuzzy search                             |

  ### `useSearch` options

  ```ts
  useSearch(query, {
    limit?: number;      // max results (default 10)
    types?: SearchType[]; // restrict to specific entity types
    debounceMs?: number; // debounce delay (default 300ms, 0 to disable)
  })
  ```

  `results` is typed as `SearchResult[]` — the discriminated union means TypeScript narrows `item`
  automatically when you branch on `type`.

  ### Example

  ```tsx
  import { useCounty, useSearch } from "kenya-locations-react";

  function LocationPicker() {
    const nairobi = useCounty("Nairobi");
    const constituencies = nairobi?.constituencies() ?? [];

    const [query, setQuery] = useState("");
    const { results, isPending } = useSearch(query, {
      types: ["constituency", "ward"],
      debounceMs: 300,
    });

    return (/* … */);
  }
  ```

### Patch Changes

- Updated dependencies
  [[`41cf80b`](https://github.com/davidamunga/kenya-locations/commit/41cf80bafc334ddb52daa5c85d570735955e11f1)]:
  - kenya-locations@0.6.0
