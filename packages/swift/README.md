# KenyaLocations Swift Package

Swift Package Manager library providing Kenyan administrative divisions — counties, sub-counties, constituencies, wards, localities, and areas.

See the [root README](../../README.md) for full API documentation and data details.

## Requirements

- Swift 5.9+
- iOS 13+ / macOS 10.15+ / tvOS 13+ / watchOS 6+

## Installation

### Swift Package Manager

In Xcode: **File → Add Package Dependencies** and enter:

```
https://github.com/DavidAmunga/kenya-locations
```

Or in `Package.swift`:

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

## Quick Start

```swift
import KenyaLocations

let shared = KenyaLocations.shared

// Get all counties
let counties = shared.getCounties()

// Relational queries
let nairobi = shared.getCountyByName("Nairobi City")
let localities = shared.getLocalitiesInCounty("Nairobi City")
let wards = shared.getWardsInConstituency("Westlands")

// Search across all entity types
let results = shared.search("karen", limit: 10)
```

## Local Development

JSON data is not committed inside this package — it is copied from `../../data/` before build:

```bash
# From packages/swift/
cp ../../data/*.json Sources/KenyaLocations/Resources/

# Then build and test normally
swift build
swift test
```

In CI this copy step runs automatically before `swift build`.
