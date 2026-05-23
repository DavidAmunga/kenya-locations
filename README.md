# Kenya Locations

A comprehensive and intuitive TypeScript package for working with Kenyan administrative divisions
including the complete hierarchy: **Counties → Localities → Areas**, plus sub-counties,
constituencies, and wards.

## Author

**David Amunga**  
Website: [https://davidamunga.com](https://davidamunga.com)

## Features

- **Complete Administrative Hierarchy** - County → Locality → Area with sub-counties,
  constituencies, and wards
- **Intuitive Chainable API** - Navigate Kenya's administrative hierarchy with ease
- **Fuzzy Search** - Search across all administrative levels (counties, localities, areas,
  constituencies, wards, sub-counties)
- **TypeScript Support** - Full type definitions included
- **High Performance** - Optimized Maps and pre-computed relationships for fast lookups
- **Complete Data** - All 47 counties, their localities, areas, sub-counties, constituencies, and
  wards
- **Lightweight** - Minimal dependencies
- **Well-Documented** - Comprehensive API documentation with examples
- **Well-Tested** - Extensive unit test coverage

## Installation

```bash
npm install kenya-locations
```

Or using other package managers:

```bash
# pnpm
pnpm add kenya-locations

# yarn
yarn add kenya-locations
```

### Basic Example

```typescript
import { getCounties, county } from "kenya-locations/counties";
import { getLocalities } from "kenya-locations/localities";
import { search } from "kenya-locations/search";
import { getCounties, getLocalities, search } from "kenya-locations";
```

### Available Modules

| Module                           | Use Case                              |
| -------------------------------- | ------------------------------------- |
| `kenya-locations/counties`       | County dropdowns, county information  |
| `kenya-locations/localities`     | Locality selection, neighborhood data |
| `kenya-locations/areas`          | Area/estate selection                 |
| `kenya-locations/constituencies` | Electoral data, constituency info     |
| `kenya-locations/wards`          | Ward-level data                       |
| `kenya-locations/sub-counties`   | Sub-county information                |
| `kenya-locations/search`         | Search functionality                  |

**Full package:** 2.56 kB (gzipped)

## Hierarchy

The library supports the complete Kenyan administrative hierarchy:

```
County (47 counties)
├── Locality (e.g., Westlands, Embakasi)
│   └── Area (e.g., Gigiri, Karen C)
├── Sub-County
├── Constituency (e.g., Westlands)
│   └── Ward (e.g., Mountain View)
```

## Quick Start

### Import Everything

```typescript
import {
  getCounties,
  county,
  getConstituencies,
  getWards,
  getLocalities,
  getAreas,
  search,
} from "kenya-locations";

// Get all counties
const counties = getCounties();

// Get specific county with chainable methods
const nairobi = county("Nairobi");
const localities = nairobi?.localities();

// Search across all types
const results = search("Westlands");
```

### Tree-Shakeable Import

```typescript
// Import only counties module
import { getCounties, county } from "kenya-locations/counties";

const counties = getCounties();
const nairobi = county("047"); // By code or name
```

## Usage

### Working with Counties

```typescript
import { getCounties, county } from "kenya-locations/counties";
// Or: import { getCounties, county } from "kenya-locations";

// Get all counties
const allCounties = getCounties();
console.log(`Total counties: ${allCounties.length}`); // 47

// Get a specific county by name or code
const mombasa = county("Mombasa"); // by name
const nairobi = county("047"); // by code

// Access county information
console.log(mombasa?.name); // "Mombasa"
console.log(mombasa?.code); // "001"
```

### Working with Localities

```typescript
import {
  getLocalities,
  getLocalityByName,
  getLocalitiesInCounty,
  locality,
} from "kenya-locations/localities";

// Get all localities
const allLocalities = getLocalities();
console.log(`Total localities: ${allLocalities.length}`); // 916

// Get a specific locality by name
const westlands = getLocalityByName("Westlands");
console.log(westlands?.county); // "Nairobi"

// Get all localities in a county
const nairobiLocalities = getLocalitiesInCounty("Nairobi");

// Get locality with optional county filter
const westlandsInNairobi = locality("Westlands", "Nairobi");
const anyWestlands = locality("Westlands"); // First match
```

### Working with Areas

```typescript
import {
  getAreas,
  getAreaByName,
  getAreasInLocality,
  getAreasInCounty,
} from "kenya-locations/areas";

// Get all areas
const allAreas = getAreas();
console.log(`Total areas: ${allAreas.length}`); // 1,829

// Get a specific area by name
const gigiri = getAreaByName("Gigiri");
console.log(gigiri?.locality); // "Westlands"
console.log(gigiri?.county); // "Nairobi"

// Get all areas in a locality
const westlandsAreas = getAreasInLocality("Westlands");

// Get all areas in a county
const nairobiAreas = getAreasInCounty("Nairobi");
```

### Working with Constituencies

```typescript
import {
  getConstituencies,
  getConstituencyByCode,
  getWardsInConstituency,
} from "kenya-locations/constituencies";

// Get all constituencies
const constituencies = getConstituencies();
console.log(`Total constituencies: ${constituencies.length}`); // 290

// Get a specific constituency by code
const changamwe = getConstituencyByCode("001");
console.log(changamwe?.name); // "Changamwe"
console.log(changamwe?.county); // "Mombasa"

// Get all wards in a constituency
const wards = getWardsInConstituency("Westlands");
```

### Working with Wards

```typescript
import { getWards, getWardsInCounty, getCountyOfWard } from "kenya-locations/wards";

// Get all wards
const allWards = getWards();
console.log(`Total wards: ${allWards.length}`); // 1,448

// Get all wards in a county
const wardsInNairobi = getWardsInCounty("Nairobi");
console.log(`Wards in Nairobi: ${wardsInNairobi.length}`); // 85

// Get the county a ward belongs to
const wardCounty = getCountyOfWard("0001");
```

### Working with Sub-Counties

```typescript
import {
  getSubCounties,
  getSubCountiesInCounty,
  getCountyOfSubCounty,
} from "kenya-locations/sub-counties";

// Get all sub-counties
const allSubCounties = getSubCounties();
console.log(`Total sub-counties: ${allSubCounties.length}`); // 307

// Get all sub-counties in a county (supports both name and code)
const subCountiesInNairobi = getSubCountiesInCounty("Nairobi"); // by name
const subCountiesInNairobiByCode = getSubCountiesInCounty("047"); // by code

// Get the county a sub-county belongs to
const subCountyCounty = getCountyOfSubCounty("Westlands");
```

### Chainable API

The package provides a chainable API for navigating the administrative hierarchy:

```typescript
import { county } from "kenya-locations/counties";
import { getLocalityByName } from "kenya-locations/localities";

// Working with Counties
const nairobi = county("Nairobi");

// Get constituencies in a county
const constituencies = nairobi?.constituencies();

// Get a specific constituency in a county
const westlands = nairobi?.constituency("Westlands");

// Get localities in a county
const localities = nairobi?.localities();

// Get a specific locality in a county
const embakasi = nairobi?.locality("Embakasi");

// Get areas in a county
const areas = nairobi?.areas();

// Get areas in a specific locality within a county
const westlandsAreas = nairobi?.areasByLocality("Westlands");

// Access county information directly from constituency
console.log(westlands?.county); // "Nairobi"

// Get wards in a constituency
const wards = westlands?.wards();

// Get a specific ward in a constituency
const ward = westlands?.ward("Mountain View");

// Working with Localities
const westlandsLocality = getLocalityByName("Westlands");

// Get all areas in this locality
const localityAreas = westlandsLocality?.areas();

// Get a specific area in the locality
const gigiri = westlandsLocality?.area("Gigiri");

// Get the county this locality belongs to
const countyObj = westlandsLocality?.getCounty();
```

### Search Functionality

The package includes a powerful fuzzy search feature that works across all administrative levels:

```typescript
import { search, searchByType } from "kenya-locations/search";

// Search across all administrative levels
const results = search("Westlands");
/*
Results include:
[
  { type: 'locality', item: { name: 'Westlands', county: 'Nairobi' } },
  { type: 'constituency', item: { code: '290', name: 'Westlands', county: 'Mombasa' } },
  { type: 'area', item: { name: 'Gigiri', locality: 'Westlands', county: 'Nairobi' } },
  // ... more results
]
*/

// Search for specific types
const countyResults = search("Nairobi", { types: ["county"] });
const localityResults = search("West", { types: ["locality", "area"] });

// Search with limit
const limitedResults = search("Nairobi", { limit: 5 });

// Search handles typos and partial matches
const typoResults = search("Nairob"); // Still finds Nairobi-related locations

// Search for a specific type
const counties = searchByType("Nairob", "county", 5);
const localities = searchByType("West", "locality", 10);
```

### Complete Hierarchy Navigation

```typescript
import { county, getAreaByName, getLocalityOfArea, getCountyOfArea } from "kenya-locations";

// Start from county and drill down
const nairobi = county("Nairobi");
const westlands = nairobi?.locality("Westlands");
const gigiri = westlands?.area("Gigiri");

console.log(`Found: ${gigiri.name} in ${gigiri.locality}, ${gigiri.county}`);
// Output: "Found: Gigiri in Westlands, Nairobi"

// Start from area and go up the hierarchy
const area = getAreaByName("Gigiri");
const locality = getLocalityOfArea("Gigiri");
const countyObj = getCountyOfArea("Gigiri");

console.log(`Hierarchy: ${countyObj?.name} → ${locality?.name} → ${area?.name}`);
// Output: "Hierarchy: Nairobi → Westlands → Gigiri"
```

### Navigating Relationships

```typescript
import { getCountyOfLocality, getCountyOfArea, getLocalityOfArea } from "kenya-locations";

// Find parent entities
const areaCounty = getCountyOfArea("Gigiri"); // County object
const areaLocality = getLocalityOfArea("Gigiri"); // Locality object
const localityCounty = getCountyOfLocality("Westlands"); // County object

console.log(areaCounty?.name); // "Nairobi"
console.log(areaLocality?.name); // "Westlands"
console.log(localityCounty?.name); // "Nairobi"
```

### Error Handling

```typescript
import { county, getLocalityByName, LocationNotFoundError } from "kenya-locations";

try {
  const nairobi = county("Nairobi");
  const locality = nairobi?.locality("NonExistentLocality");
} catch (error) {
  if (error instanceof LocationNotFoundError) {
    console.log("Locality not found:", error.message);
  }
}

try {
  const westlands = getLocalityByName("Westlands");
  const area = westlands?.area("NonExistentArea");
} catch (error) {
  if (error instanceof LocationNotFoundError) {
    console.log("Area not found:", error.message);
  }
}
```

## API Reference

### Counties Module

**Import:** `import { ... } from "kenya-locations/counties"`

- `getCounties(): County[]` - Get all counties
- `getCountyByCode(code: string): County | undefined` - Get county by code
- `getCountyByName(name: string): County | undefined` - Get county by name
- `county(nameOrCode: string): CountyWrapper | undefined` - Get county with chainable methods

### Localities Module

**Import:** `import { ... } from "kenya-locations/localities"`

- `getLocalities(): Locality[]` - Get all localities
- `getLocalityByName(name: string): LocalityWrapper | undefined` - Get locality by name
- `getLocalitiesInCounty(countyName: string): Locality[]` - Get localities in a county
- `getCountyOfLocality(localityName: string): County | undefined` - Get county of locality
- `locality(name: string, countyName?: string): LocalityWrapper | undefined` - Get locality with
  optional county filter

### Areas Module

**Import:** `import { ... } from "kenya-locations/areas"`

- `getAreas(): Area[]` - Get all areas
- `getAreaByName(name: string): Area | undefined` - Get area by name
- `getAreasInLocality(localityName: string): Area[]` - Get areas in a locality
- `getAreasInCounty(countyName: string): Area[]` - Get areas in a county
- `getCountyOfArea(areaName: string): County | undefined` - Get county of area
- `getLocalityOfArea(areaName: string): Locality | undefined` - Get locality of area

### Constituencies Module

**Import:** `import { ... } from "kenya-locations/constituencies"`

- `getConstituencies(): Constituency[]` - Get all constituencies
- `getConstituencyByCode(code: string): ConstituencyWrapper | undefined` - Get constituency by code
- `getConstituencyByName(name: string): ConstituencyWrapper | undefined` - Get constituency by name
- `getWardsInConstituency(constituencyNameOrCode: string): Ward[]` - Get wards in constituency
- `getCountyOfConstituency(constituencyNameOrCode: string): County | undefined` - Get county of
  constituency

### Wards Module

**Import:** `import { ... } from "kenya-locations/wards"`

- `getWards(): Ward[]` - Get all wards
- `getWardByCode(code: string): Ward | undefined` - Get ward by code
- `getWardByName(name: string): Ward | undefined` - Get ward by name
- `getWardsInCounty(countyNameOrCode: string): Ward[]` - Get wards in county
- `getCountyOfWard(wardNameOrCode: string): County | undefined` - Get county of ward

### Sub-Counties Module

**Import:** `import { ... } from "kenya-locations/sub-counties"`

- `getSubCounties(): SubCounty[]` - Get all sub-counties
- `getSubCountyByCode(code: string): SubCounty | undefined` - Get sub-county by code
- `getSubCountyByName(name: string): SubCounty | undefined` - Get sub-county by name
- `getSubCountiesInCounty(countyNameOrCode: string): SubCounty[]` - Get sub-counties in county
- `getCountyOfSubCounty(subCountyName: string): County | undefined` - Get county of sub-county
- `getWardsInSubCounty(subCountyCode: string): Ward[]` - Get wards in sub-county

### Search Module

**Import:** `import { ... } from "kenya-locations/search"`

- `search(query: string, options?: SearchOptions): SearchResult[]` - Search across all or specific
  types
- `searchByType(query: string, type: SearchType, limit?: number): SearchResult[]` - Search for
  specific type

**SearchOptions Interface:**

```typescript
interface SearchOptions {
  limit?: number; // Maximum number of results
  types?: SearchType[]; // Types to search: 'county' | 'constituency' | 'ward' | 'sub-county' | 'locality' | 'area'
}
```

### Wrapper Classes

#### CountyWrapper

Provides chainable methods for navigating from a county:

- `code: string` - Get the county code
- `name: string` - Get the county name
- `data: County` - Get all data for the county
- `constituencies(): ConstituencyWrapper[]` - Get all constituencies in this county
- `constituency(nameOrCode: string): ConstituencyWrapper` - Get a constituency by name or code
- `localities(): LocalityWrapper[]` - Get all localities in this county
- `locality(name: string): LocalityWrapper` - Get a locality by name
- `areas(): Area[]` - Get all areas in this county
- `areasByLocality(localityName: string): Area[]` - Get areas in a specific locality
- `wards(): Ward[]` - Get all wards in this county

#### ConstituencyWrapper

Provides chainable methods for navigating from a constituency:

- `code: string` - Get the constituency code
- `name: string` - Get the constituency name
- `county: string` - Get the county name this constituency belongs to
- `data: Constituency` - Get all data for the constituency
- `getCounty(): County | undefined` - Get the county this constituency belongs to
- `wards(): Ward[]` - Get all wards in this constituency
- `ward(nameOrCode: string): Ward` - Get a ward by name or code

#### LocalityWrapper

Provides chainable methods for navigating from a locality:

- `name: string` - Get the locality name
- `county: string` - Get the county name this locality belongs to
- `data: Locality` - Get all data for the locality
- `getCounty(): County | undefined` - Get the county this locality belongs to
- `areas(): Area[]` - Get all areas in this locality
- `area(name: string): Area` - Get an area by name

### Data Interfaces

```typescript
interface County {
  code: string;
  name: string;
}

interface Locality {
  name: string;
  county: string;
}

interface Area {
  name: string;
  locality: string;
  county: string;
}

interface Constituency {
  code: string;
  name: string;
  county: string;
}

interface Ward {
  code: string;
  name: string;
  constituency: string;
}

interface SubCounty {
  code: string;
  name: string;
  county: string;
}

interface SearchResult {
  type: "county" | "constituency" | "ward" | "sub-county" | "locality" | "area";
  item: County | Constituency | Ward | SubCounty | Locality | Area;
}
```

## Examples

The package includes comprehensive examples:

- `examples/basic-usage.html` - Complete interactive example showing all functionality

To run the examples:

```bash
# Clone the repository
git clone https://github.com/DavidAmunga/kenya-locations.git

# Navigate to the project
cd kenya-locations

# Install dependencies
pnpm install

# Build the library
pnpm run build
```

## Real-World Use Cases

### County Dropdown

```typescript
import { getCounties } from "kenya-locations/counties";

function CountyDropdown() {
  const counties = getCounties();

  return (
    <select>
      {counties.map((county) => (
        <option key={county.code} value={county.code}>
          {county.name}
        </option>
      ))}
    </select>
  );
}
```

### Location Search

```typescript
import { search } from "kenya-locations/search";

function LocationSearch({ query }: { query: string }) {
  const results = search(query, { limit: 10 });

  return (
    <ul>
      {results.map((result, index) => (
        <li key={index}>
          {result.type}: {result.item.name}
        </li>
      ))}
    </ul>
  );
}
```

### Hierarchical Location Selector

```typescript
import { getCounties } from "kenya-locations/counties";
import { getLocalitiesInCounty } from "kenya-locations/localities";
import { getAreasInLocality } from "kenya-locations/areas";

function AddressForm() {
  const [county, setCounty] = useState("");
  const [locality, setLocality] = useState("");

  const counties = getCounties();
  const localities = county ? getLocalitiesInCounty(county) : [];
  const areas = locality ? getAreasInLocality(locality) : [];

  return (
    <form>
      <select onChange={(e) => setCounty(e.target.value)}>
        <option value="">Select County</option>
        {counties.map((c) => (
          <option key={c.code} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <select disabled={!county} onChange={(e) => setLocality(e.target.value)}>
        <option value="">Select Locality</option>
        {localities.map((l) => (
          <option key={l.name} value={l.name}>
            {l.name}
          </option>
        ))}
      </select>

      <select disabled={!locality}>
        <option value="">Select Area</option>
        {areas.map((a) => (
          <option key={a.name} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

## Contributing

Contributions are welcome! We especially welcome contributions to expand our locality and area data.

**[Read our detailed Contributing Guidelines](CONTRIBUTING.md)** for information on:

- How to add new counties, sub-counties, constituencies, wards, localities, and areas
- Data structure and validation requirements
- Testing procedures
- Submission guidelines

**Pre-commit Hooks:** This project uses automated pre-commit hooks to ensure code quality and data
integrity. When you commit changes, the following happen automatically:

- Code formatting and linting
- Data validation (when data files are changed)
- Test execution
- Commit message format validation

**Learn More:** See [Pre-commit Hooks Documentation](docs/PRE_COMMIT_HOOKS.md) for detailed
information.

Please feel free to submit a Pull Request following our guidelines.

## Community

### Get Help & Discuss

- [GitHub Discussions](https://github.com/DavidAmunga/kenya-locations/discussions) - Ask questions,
  share ideas
- [Report Issues](https://github.com/DavidAmunga/kenya-locations/issues/new/choose) - Bug reports,
  feature requests
- [Documentation](./CONTRIBUTING.md) - Contributing guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our
[Code of Conduct](CODE_OF_CONDUCT.md).

### Security

Found a security vulnerability? Please review our [Security Policy](SECURITY.md) for responsible
disclosure.

### Contributors

Thanks to all our contributors! See the full list in [CONTRIBUTORS.md](CONTRIBUTORS.md).

Want to contribute? Check out:

- [Good First Issues](https://github.com/DavidAmunga/kenya-locations/labels/good%20first%20issue)
- [Data Contributions](https://kenya-locations.web.app/)
- [Contributing Guide](CONTRIBUTING.md)

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Data Sources

The data in this package is sourced from official records of:

- Independent Electoral and Boundaries Commission (IEBC) of Kenya
- Kenya National Bureau of Statistics (KNBS)
- County government records for locality and area classifications

## Acknowledgments

- The Independent Electoral and Boundaries Commission (IEBC) of Kenya
- Kenya National Bureau of Statistics (KNBS)
- County governments for locality and area data
- All our [contributors](CONTRIBUTORS.md) who help make this project better

## Support the Project

If you find this project useful:

- **Star the repository** on GitHub
- **Share it** with others who might find it useful
- **Report bugs** or **request features**
- **Contribute** code or data
- **Sponsor** the project (see [Funding](https://github.com/sponsors/davidamunga))

---

**Made with care in Kenya**

For questions or support, visit [davidamunga.com](https://davidamunga.com) or open an issue on
GitHub.
