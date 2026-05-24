import XCTest
@testable import KenyaLocations

// Resolve data/ relative to this test file: Tests/KenyaLocationsTests/ → ../../../data/
private let dataDir: URL = URL(fileURLWithPath: #file)
    .deletingLastPathComponent() // KenyaLocationsTests/
    .deletingLastPathComponent() // Tests/
    .deletingLastPathComponent() // swift/
    .deletingLastPathComponent() // packages/
    .appendingPathComponent("data")

private func loadFixture<T: Decodable>(_ name: String) throws -> [T] {
    let url = dataDir.appendingPathComponent("\(name).json")
    let data = try Data(contentsOf: url)
    return try JSONDecoder().decode([T].self, from: data)
}

final class KenyaLocationsTests: XCTestCase {

    // ─── County ───────────────────────────────────────────────────────────────

    func testCountyCountEquals47() throws {
        let counties: [County] = try loadFixture("counties")
        XCTAssertEqual(counties.count, 47, "Kenya has exactly 47 counties")
    }

    func testAllCountiesHaveNonBlankCodeAndName() throws {
        let counties: [County] = try loadFixture("counties")
        for county in counties {
            XCTAssertFalse(county.code.isEmpty, "County code must not be blank: \(county)")
            XCTAssertFalse(county.name.isEmpty, "County name must not be blank: \(county)")
        }
    }

    func testCountyCodesAreUnique() throws {
        let counties: [County] = try loadFixture("counties")
        let codes = counties.map { $0.code }
        XCTAssertEqual(codes.count, Set(codes).count, "County codes must be unique")
    }

    func testNairobiCountyExists() throws {
        let counties: [County] = try loadFixture("counties")
        let nairobi = counties.first { $0.name == "Nairobi City" || $0.name == "Nairobi" }
        XCTAssertNotNil(nairobi, "Nairobi county should exist")
    }

    // ─── Sub-counties ─────────────────────────────────────────────────────────

    func testSubCountyCountyReferencesAreValid() throws {
        let subCounties: [SubCounty] = try loadFixture("sub-counties")
        let counties: [County] = try loadFixture("counties")
        let countyNames = Set(counties.map { $0.name })
        let invalid = subCounties.filter { !countyNames.contains($0.county) }
        XCTAssertTrue(invalid.isEmpty, "All sub-county county refs must be valid. Invalid: \(invalid.prefix(5))")
    }

    // ─── Constituencies ───────────────────────────────────────────────────────

    func testConstituencyCountyReferencesAreValid() throws {
        let constituencies: [Constituency] = try loadFixture("constituencies")
        let counties: [County] = try loadFixture("counties")
        let countyNames = Set(counties.map { $0.name })
        let invalid = constituencies.filter { !countyNames.contains($0.county) }
        XCTAssertTrue(invalid.isEmpty, "All constituency county refs must be valid. Invalid: \(invalid.prefix(5))")
    }

    // ─── Wards ────────────────────────────────────────────────────────────────

    func testWardConstituencyReferencesAreValid() throws {
        let wards: [Ward] = try loadFixture("wards")
        let constituencies: [Constituency] = try loadFixture("constituencies")
        let constituencyNames = Set(constituencies.map { $0.name })
        let invalid = wards.filter { !constituencyNames.contains($0.constituency) }
        XCTAssertTrue(invalid.isEmpty, "All ward constituency refs must be valid. Invalid: \(invalid.prefix(5))")
    }

    // ─── Areas ────────────────────────────────────────────────────────────────

    func testAreaLocalityReferencesAreValid() throws {
        let areas: [Area] = try loadFixture("area")
        let localities: [Locality] = try loadFixture("locality")
        let localityNames = Set(localities.map { $0.name })
        let invalid = areas.filter { !localityNames.contains($0.locality) }
        XCTAssertTrue(invalid.isEmpty, "All area locality refs must be valid. Invalid: \(invalid.prefix(5))")
    }

    // ─── Models round-trip ────────────────────────────────────────────────────

    func testModelsDecodeAndReencode() throws {
        let counties: [County] = try loadFixture("counties")
        let encoded = try JSONEncoder().encode(counties)
        let decoded = try JSONDecoder().decode([County].self, from: encoded)
        XCTAssertEqual(counties, decoded)
    }
}
