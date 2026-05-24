# Kenya Locations

[![npm version](https://img.shields.io/npm/v/kenya-locations.svg)](https://www.npmjs.com/package/kenya-locations)
[![Maven Central](https://img.shields.io/maven-central/v/io.github.davidamunga/kenya-locations.svg)](https://central.sonatype.com/artifact/io.github.davidamunga/kenya-locations)
[![CI](https://github.com/DavidAmunga/kenya-locations/actions/workflows/ci.yml/badge.svg)](https://github.com/DavidAmunga/kenya-locations/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Kenyan administrative divisions — counties, sub-counties, constituencies, wards, localities, and areas — packaged as a fast, well-typed library for JavaScript/TypeScript, Kotlin/JVM, and Swift.

**47** counties · **307** sub-counties · **290** constituencies · **1,448** wards · **916** localities · **1,829** areas

---

## Packages

| Platform | Package | Install |
|---|---|---|
| **JavaScript / TypeScript** | [`kenya-locations`](https://www.npmjs.com/package/kenya-locations) | `npm install kenya-locations` |
| **Kotlin / JVM** (Android, Spring Boot, etc.) | [`io.github.davidamunga:kenya-locations`](https://central.sonatype.com/artifact/io.github.davidamunga/kenya-locations) | See below |
| **Swift** (iOS, macOS, tvOS, watchOS) | [`KenyaLocations`](https://swiftpackageindex.com/davidamunga/kenya-locations) | See below |

All packages are built from the same JSON source data and share identical version numbers.

---

## Installation

### JavaScript / TypeScript

```bash
npm install kenya-locations
# pnpm add kenya-locations
# yarn add kenya-locations
```

### Kotlin / JVM

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.davidamunga:kenya-locations:0.5.4")
}
```

Works on Android, Spring Boot, Ktor, CLI tools, and any JVM project. No Android SDK or special initialisation required — data loads lazily from the JAR classpath on first access.

### Swift (iOS, macOS, tvOS, watchOS)

In Xcode: **File → Add Package Dependencies** and enter `https://github.com/DavidAmunga/kenya-locations`, or add to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/DavidAmunga/kenya-locations", from: "0.5.0"),
],
targets: [
    .target(
        name: "YourTarget",
        dependencies: [
            .product(name: "KenyaLocations", package: "kenya-locations"),
        ]
    ),
]
```

Requires Swift 5.9+ / iOS 13+ / macOS 10.15+. Data loads lazily from the app bundle on first access.

---

## Quick Start

### JavaScript / TypeScript

```typescript
// Tree-shakeable imports (recommended)
import { getCounties, county } from "kenya-locations/counties";
import { getLocalitiesInCounty } from "kenya-locations/localities";
import { search } from "kenya-locations/search";

// Get all counties
const counties = getCounties(); // County[]

// Chainable API
const nairobi = county("Nairobi");
const localities = nairobi?.localities();
const westlands = nairobi?.locality("Westlands");
const areas = westlands?.areas();

// Search across all entity types
const results = search("karen", { limit: 10 });
```

### Kotlin / JVM

```kotlin
// No init() required — just call directly
val counties   = KenyaLocations.getCounties()
val wards      = KenyaLocations.getWardsInConstituency("Westlands")
val localities = KenyaLocations.getLocalitiesInCounty("Nairobi City")
val results    = KenyaLocations.search("karen")

// Java
List<County> counties = KenyaLocations.INSTANCE.getCounties();
```

### Swift

```swift
import KenyaLocations

let kl = KenyaLocations.shared

// Get all counties
let counties = kl.getCounties()

// Relational queries
let wards      = kl.getWardsInConstituency("Westlands")
let localities = kl.getLocalitiesInCounty("Nairobi City")

// Search across all entity types
let results = kl.search("karen", limit: 10)
```

---

## Data Hierarchy

```
County (47)
├── Locality → Area          (informal addressing: estates, neighbourhoods)
│   916 localities · 1,829 areas
└── Constituency → Ward      (electoral / administrative)
    290 constituencies · 1,448 wards
    └── Sub-County (307)
```

---

## JavaScript API

### Modules

Import only what you need for optimal tree-shaking:

| Module | Contents |
|---|---|
| `kenya-locations/counties` | `getCounties`, `getCountyByCode`, `getCountyByName`, `county` |
| `kenya-locations/localities` | `getLocalities`, `getLocalityByName`, `getLocalitiesByName`, `getLocalitiesInCounty`, `locality` |
| `kenya-locations/areas` | `getAreas`, `getAreaByName`, `getAreasInLocality`, `getAreasInCounty` |
| `kenya-locations/constituencies` | `getConstituencies`, `getConstituencyByCode`, `getConstituencyByName`, `getWardsInConstituency` |
| `kenya-locations/wards` | `getWards`, `getWardByCode`, `getWardByName`, `getWardsInCounty` |
| `kenya-locations/sub-counties` | `getSubCounties`, `getSubCountiesInCounty`, `getWardsInSubCounty` |
| `kenya-locations/search` | `search`, `searchByType` |
| `kenya-locations/version` | `DATA_VERSION` |

Or import everything from the root entry point:

```typescript
import { getCounties, search, county, DATA_VERSION } from "kenya-locations";
```

### Chainable Wrappers

```typescript
import { county } from "kenya-locations/counties";
import { locality } from "kenya-locations/localities";

// County → drill down
county("Nairobi")?.constituencies();           // ConstituencyWrapper[]
county("Nairobi")?.constituency("Westlands");  // ConstituencyWrapper
county("Nairobi")?.localities();               // LocalityWrapper[]
county("Nairobi")?.locality("Westlands");      // LocalityWrapper
county("Nairobi")?.areas();                    // Area[]
county("047")?.wards();                        // Ward[]

// Constituency → wards
county("Nairobi")?.constituency("Westlands")?.wards();

// Locality → areas
locality("Westlands")?.areas();
locality("Westlands")?.area("Gigiri");
locality("Westlands")?.getCounty();
```

### Search

```typescript
import { search, searchByType } from "kenya-locations/search";

// Search all types
const results = search("westlands");
// [{ type: 'locality', item: {...} }, { type: 'constituency', item: {...} }, ...]

// Filter by type and limit
const counties    = search("nairobi", { types: ["county"], limit: 5 });
const localities  = searchByType("west", "locality", 10);
```

### Data Types

```typescript
interface County        { code: string; name: string; }
interface SubCounty     { code: string; name: string; county: string; }
interface Constituency  { code: string; name: string; county: string; }
interface Ward          { code: string; name: string; constituency: string; }
interface Locality      { name: string; county: string; }
interface Area          { name: string; locality: string; county: string; }

interface SearchResult {
  type: "county" | "sub-county" | "constituency" | "ward" | "locality" | "area";
  item: County | SubCounty | Constituency | Ward | Locality | Area;
}
```

### Error Handling

```typescript
import { LocationNotFoundError, LocationError } from "kenya-locations";

try {
  county("Nairobi")?.locality("NonExistent"); // throws LocationNotFoundError
} catch (e) {
  if (e instanceof LocationNotFoundError) { ... }
}
```

Error hierarchy: `LocationError` → `LocationNotFoundError`, `InvalidLocationCodeError`, `SearchError`, `DataValidationError`, `ConfigurationError`

---

## Kotlin API

### Getters

```kotlin
KenyaLocations.getCounties()                           // List<County>
KenyaLocations.getCountyByCode("047")                  // County?
KenyaLocations.getCountyByName("Nairobi City")         // County?
KenyaLocations.getSubCounties()                        // List<SubCounty>
KenyaLocations.getConstituencies()                     // List<Constituency>
KenyaLocations.getWards()                              // List<Ward>
KenyaLocations.getLocalities()                         // List<Locality>
KenyaLocations.getAreas()                              // List<Area>
```

### Relational queries

```kotlin
KenyaLocations.getSubCountiesInCounty("Nairobi City")
KenyaLocations.getConstituenciesInCounty("Nairobi City")
KenyaLocations.getWardsInConstituency("Westlands")
KenyaLocations.getWardsInCounty("Nairobi City")
KenyaLocations.getLocalitiesInCounty("Nairobi City")
KenyaLocations.getAreasInLocality("Karen")
KenyaLocations.getAreasInCounty("Nairobi City")
```

### Search

```kotlin
KenyaLocations.search("karen", limit = 20)           // List<SearchResult<*>>
KenyaLocations.searchByType("west", SearchType.WARD) // List<SearchResult<*>>
```

### Data classes

```kotlin
data class County(val code: String, val name: String)
data class SubCounty(val code: String, val name: String, val county: String)
data class Constituency(val code: String, val name: String, val county: String)
data class Ward(val code: String, val name: String, val constituency: String)
data class Locality(val name: String, val county: String)
data class Area(val name: String, val locality: String, val county: String)
```

---

## Contributing

Contributions are very welcome — especially data additions (new localities, areas, corrections).

**Data files are plain JSON** in `data/`. No TypeScript or Kotlin knowledge needed to add entries. The pre-commit hook validates data automatically on every commit.

```
data/
├── counties.json
├── sub-counties.json
├── constituencies.json
├── wards.json
├── locality.json
└── area.json
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for data structure, validation rules, and submission guidelines. Submit new areas via the [web app](https://kenya-locations.web.app/) or directly via a PR.

---

## Repository Structure

```
kenya-locations/
├── data/                    ← shared JSON source of truth (all libraries read from here)
├── packages/
│   ├── js/                  ← TypeScript library → npm: kenya-locations
│   ├── kotlin/              ← Kotlin/JVM library → Maven: io.github.davidamunga:kenya-locations
│   └── swift/               ← Swift library → Swift Package Index: KenyaLocations
├── apps/
│   └── web/                 ← interactive demo (kenya-locations.web.app)
└── scripts/
    └── validate-data.js     ← data integrity checks (runs on commit + CI)
```

---

## License

MIT © [David Amunga](https://davidamunga.com)

Data sourced from the Independent Electoral and Boundaries Commission (IEBC) and Kenya National Bureau of Statistics (KNBS).
