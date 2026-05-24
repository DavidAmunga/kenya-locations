// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "KenyaLocations",
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
            resources: [
                .process("Resources"),
            ]
        ),
        .testTarget(
            name: "KenyaLocationsTests",
            dependencies: ["KenyaLocations"]
        ),
    ]
)
