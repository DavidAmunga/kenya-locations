# Changelog

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
