# 🇰🇪 Kenya Locations

A comprehensive and intuitive TypeScript package for working with Kenyan administrative divisions
including the complete hierarchy: **Counties → Localities → Areas**, plus sub-counties,
constituencies, and wards.

## Author

**David Amunga**  
Website: [https://davidamunga.com](https://davidamunga.com)

## Features

- 🏗️ **Complete Administrative Hierarchy** - County → Locality → Area with sub-counties,
  constituencies, and wards
- 🔍 **Intuitive chainable API** for navigating Kenya's administrative hierarchy
- 🔎 **Fuzzy search** capabilities across all administrative levels (counties, localities, areas,
  constituencies, wards, sub-counties)
- 🧩 **TypeScript support** with full type definitions
- 🚀 **Lightning-fast performance** with optimized Maps and pre-computed relationships
- 📊 **Complete data** for all 47 counties, their localities, areas, sub-counties, constituencies,
  and wards
- 📱 **Lightweight** with minimal dependencies
- 📖 **Well-documented** API with examples
- ✅ **Well-tested** with comprehensive unit tests

## Installation

```bash
npm install kenya-locations
```

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

## Usage

### Basic Usage

You can use the standalone functions directly:

```typescript
import {
  getCounties,
  county,
  getConstituencies,
  getConstituencyByCode,
  getWards,
  getWardsInCounty,
  getCountyOfWard,
  search,
  getSubCounties,
  getSubCountiesInCounty,
  getCountyOfSubCounty,
  getWardsInSubCounty,
  getLocalities,
  getAreas,
  getLocalityByName,
  getAreaByName,
  getLocalitiesInCounty,
  getAreasInLocality,
  getAreasInCounty,
  getCountyOfLocality,
  getCountyOfArea,
  getLocalityOfArea,
  locality,
} from "kenya-locations";

// Get all counties
const allCounties = getCounties();

// Get a specific county by name or code
const mombasa = county("Mombasa"); // or county('001')

// Get all constituencies
const constituencies = getConstituencies();

// Get a specific constituency by code
const changamwe = getConstituencyByCode("290");
// Access county information directly from constituency
console.log(changamwe?.county.name); // "Mombasa"
console.log(changamwe?.county.code); // "001"

// Get all wards
const wards = getWards();

// Get all wards in a county
const wardsInMombasa = getWardsInCounty("001");

// Get the county a ward belongs to
const wardCounty = getCountyOfWard("0001");

// Get all sub-counties
const allSubCounties = getSubCounties();

// Get all sub-counties in a county (supports both name and code)
const subCountiesInMombasa = getSubCountiesInCounty("Mombasa"); // by name
const subCountiesInMombasaByCode = getSubCountiesInCounty("001"); // by code

// Get the county a sub-county belongs to
const subCountyCounty = getCountyOfSubCounty("subCountyName");

// Get all wards in a sub-county
const wardsInSubCounty = getWardsInSubCounty("subCountyCode");
```

### Working with Localities and Areas

```typescript
import {
  getLocalities,
  getAreas,
  getLocalityByName,
  getAreaByName,
  getLocalitiesInCounty,
  getAreasInLocality,
  getAreasInCounty,
  getCountyOfLocality,
  getCountyOfArea,
  getLocalityOfArea,
  locality,
} from "kenya-locations";

// Get all localities
const allLocalities = getLocalities();

// Get all areas
const allAreas = getAreas();

// Get a specific locality by name
const westlands = getLocalityByName("Westlands");
console.log(westlands?.county); // "Nairobi"

// Get a specific area by name
const gigiri = getAreaByName("Gigiri");
console.log(gigiri?.locality); // "Westlands"
console.log(gigiri?.county); // "Nairobi"

// Get all localities in a county
const nairobiLocalities = getLocalitiesInCounty("Nairobi");

// Get all areas in a locality
const westlandsAreas = getAreasInLocality("Westlands");

// Get all areas in a county
const nairobiAreas = getAreasInCounty("Nairobi");

// Find parent entities
const areaCounty = getCountyOfArea("Gigiri"); // County object
const areaLocality = getLocalityOfArea("Gigiri"); // Locality object
const localityCounty = getCountyOfLocality("Westlands"); // County object

// Get locality with optional county filter
const westlandsInNairobi = locality("Westlands", "Nairobi");
const anyWestlands = locality("Westlands"); // First match
```

### Chainable API

The package provides a chainable API for navigating the administrative hierarchy:

```typescript
import { county, getLocalityByName } from "kenya-locations";

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
console.log(westlands?.county.name); // "Nairobi"
console.log(westlands?.county.code); // "047"

// Get wards in a constituency
const wards = westlands?.wards();

// Get a specific ward in a constituency
const ward = westlands?.ward("Mountain View");

// Working with Localities
const westlandsLocality = getLocalityByName("Westlands");

// Get all areas in this locality
const areas = westlandsLocality?.areas();

// Get a specific area in the locality
const gigiri = westlandsLocality?.area("Gigiri");

// Get the county this locality belongs to
const county = westlandsLocality?.getCounty();
```

### Search Functionality

The package includes a powerful fuzzy search feature that works across all administrative levels:

```typescript
import { search } from "kenya-locations";

// Search across all administrative levels
const results = search("Westlands");
/*
Results include:
[
  { type: 'locality', item: { name: 'Westlands', county: 'Nairobi' } },
  { type: 'constituency', item: { code: '290', name: 'Westlands', county: { code: '047', name: 'Nairobi' } } },
  { type: 'area', item: { name: 'Gigiri', locality: 'Westlands', county: 'Nairobi' } },
  // ... more results
]
*/

// Search for areas
const areaResults = search("Gigiri");
/*
Results:
[
  { type: 'area', item: { name: 'Gigiri', locality: 'Westlands', county: 'Nairobi' } }
]
*/

// Search with limit
const limitedResults = search("Nairobi", 5); // Maximum 5 results

// Search handles typos and partial matches
const typoResults = search("Nairob"); // Still finds Nairobi-related locations
```

### Complete Hierarchy Navigation Example

```typescript
import { county, getAreaByName, getLocalityOfArea, getCountyOfArea } from "kenya-locations";

// Start from county and drill down
const nairobi = county("Nairobi");
const westlands = nairobi?.locality("Westlands");
const gigiri = westlands?.area("Gigiri");

console.log(`Found: ${gigiri.name} in ${gigiri.locality}, ${gigiri.county}`);

// Start from area and go up the hierarchy
const area = getAreaByName("Gigiri");
const locality = getLocalityOfArea("Gigiri");
const county = getCountyOfArea("Gigiri");

console.log(`Hierarchy: ${county?.name} → ${locality?.name} → ${area?.name}`);
// Output: "Hierarchy: Nairobi → Westlands → Gigiri"
```

### Error Handling

```typescript
import { county, getLocalityByName, NotFoundError } from "kenya-locations";

try {
  const nairobi = county("Nairobi");
  const locality = nairobi?.locality("NonExistentLocality");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Locality not found:", error.message);
  }
}

try {
  const westlands = getLocalityByName("Westlands");
  const area = westlands?.area("NonExistentArea");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Area not found:", error.message);
  }
}
```

## Examples

The package includes comprehensive examples:

- `examples/basic-usage.html`: A complete interactive example showing all functionality including
  the County → Locality → Area hierarchy
- All functions demonstrated with working code
- Search functionality across all administrative levels

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

# Open examples/basic-usage.html in your browser
```

## API Reference

### Main Functions

#### Counties

- `getCounties()`: Get all counties
- `county(nameOrCode)`: Get a county by name or code

#### Localities

- `getLocalities()`: Get all localities
- `getLocalityByName(name)`: Get a locality by name
- `getLocalitiesInCounty(countyName)`: Get all localities in a county
- `getCountyOfLocality(localityName)`: Get the county a locality belongs to
- `locality(name, countyName?)`: Get a locality by name, optionally filtered by county

#### Areas

- `getAreas()`: Get all areas
- `getAreaByName(name)`: Get an area by name
- `getAreasInLocality(localityName)`: Get all areas in a locality
- `getAreasInCounty(countyName)`: Get all areas in a county
- `getCountyOfArea(areaName)`: Get the county an area belongs to
- `getLocalityOfArea(areaName)`: Get the locality an area belongs to

#### Constituencies

- `getConstituencies()`: Get all constituencies
- `getConstituencyByCode(code)`: Get a constituency by code
- `getCountyOfConstituency(constituencyCode)`: Get the county a constituency belongs to

#### Wards

- `getWards()`: Get all wards
- `getWardsInCounty(countyNameOrCode)`: Get all wards in a county
- `getWardsInConstituency(constituencyCode)`: Get all wards in a constituency
- `getCountyOfWard(wardCode)`: Get the county a ward belongs to

#### Sub-Counties

- `getSubCounties()`: Get all sub-counties
- `getSubCountiesInCounty(countyNameOrCode)`: Get all sub-counties in a county
- `getCountyOfSubCounty(subCountyName)`: Get the county a sub-county belongs to
- `getWardsInSubCounty(subCountyCode)`: Get all wards in a sub-county

#### Search

- `search(query, limit?)`: Search across all administrative levels (counties, localities, areas,
  constituencies, wards, sub-counties)

### Wrapper Classes

#### CountyWrapper Class

- `code`: Get the county code
- `name`: Get the county name
- `data`: Get all data for the county
- `constituencies()`: Get all constituencies in this county
- `constituency(nameOrCode)`: Get a constituency by name or code
- `localities()`: Get all localities in this county
- `locality(name)`: Get a locality by name
- `areas()`: Get all areas in this county
- `areasByLocality(localityName)`: Get areas in a specific locality
- `wards()`: Get all wards in this county

#### ConstituencyWrapper Class

- `code`: Get the constituency code
- `name`: Get the constituency name
- `county`: Get the county object this constituency belongs to (contains code and name)
- `data`: Get all data for the constituency
- `getCounty()`: Get the county this constituency belongs to as a CountyWrapper
- `wards()`: Get all wards in this constituency
- `ward(nameOrCode)`: Get a ward by name or code

#### LocalityWrapper Class

- `name`: Get the locality name
- `county`: Get the county name this locality belongs to
- `data`: Get all data for the locality
- `getCounty()`: Get the county this locality belongs to as a CountyWrapper
- `areas()`: Get all areas in this locality
- `area(name)`: Get an area by name

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
  county: County;
}

interface Ward {
  code: string;
  name: string;
  constituencyCode: string;
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

## Contributing

Contributions are welcome! We especially welcome contributions to expand our locality and area data.

📖 **[Read our detailed Contributing Guidelines](CONTRIBUTING.md)** for information on:

- How to add new counties, sub-counties, constituencies, wards, localities, and areas
- Data structure and validation requirements
- Testing procedures
- Submission guidelines

🪝 **Pre-commit Hooks**: This project uses automated pre-commit hooks to ensure code quality and
data integrity. When you commit changes, the following happen automatically:

- Code formatting and linting
- Data validation (when data files are changed)
- Test execution
- Commit message format validation

📋 **Learn More**: See [Pre-commit Hooks Documentation](docs/PRE_COMMIT_HOOKS.md) for detailed
information.

Please feel free to submit a Pull Request following our guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Data Sources

The data in this package is sourced from official records of:

- Independent Electoral and Boundaries Commission (IEBC) of Kenya
- Kenya National Bureau of Statistics (KNBS)
- County government records for locality and area classifications

## Acknowledgments

- The Independent Electoral and Boundaries Commission (IEBC) of Kenya
- Kenya National Bureau of Statistics (KNBS)
- County governments for locality and area data
