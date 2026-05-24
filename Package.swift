// swift-tools-version: 5.9

import PackageDescription

// Root Package.swift — enables `https://github.com/DavidAmunga/kenya-locations`
// as a Swift Package Manager dependency without any subpath configuration.
//
// Sources live in packages/swift/Sources/KenyaLocations/ alongside the
// per-platform Package.swift used for local development and CI testing.

let package = Package(
    name: "kenya-locations",
    platforms: [
        .iOS(.v13),
        .macOS(.v10_15),
        .tvOS(.v13),
        .watchOS(.v6),
    ],
    products: [
        .library(
            name: "KenyaLocations",
            targets: ["KenyaLocations"]
        ),
    ],
    targets: [
        .target(
            name: "KenyaLocations",
            path: "packages/swift/Sources/KenyaLocations",
            resources: [
                .process("Resources"),
            ]
        ),
    ]
)
