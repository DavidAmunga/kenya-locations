import Foundation

/// Main entry point for the kenya-locations library.
///
/// Works on iOS, macOS, tvOS, watchOS, and any Swift/Apple platform.
/// Data is parsed lazily on first access and cached for the lifetime of the process.
///
/// Usage:
/// ```swift
/// let counties  = KenyaLocations.shared.getCounties()
/// let wards     = KenyaLocations.shared.getWardsInConstituency("Westlands")
/// let results   = KenyaLocations.shared.search("karen")
/// ```
public final class KenyaLocations: @unchecked Sendable {

    public static let shared = KenyaLocations()

    private let decoder = JSONDecoder()
    private let lock = NSLock()

    // Backing storage for lazy-loaded data
    private var _counties: [County]?
    private var _subCounties: [SubCounty]?
    private var _constituencies: [Constituency]?
    private var _wards: [Ward]?
    private var _localities: [Locality]?
    private var _areas: [Area]?

    // Fast lookup maps
    private var _countiesByCode: [String: County]?
    private var _countiesByName: [String: County]?
    private var _constituenciesByCode: [String: Constituency]?
    private var _constituenciesByName: [String: Constituency]?

    private init() {}

    // ─── Getters ──────────────────────────────────────────────────────────────

    public func getCounties() -> [County] { counties }
    public func getSubCounties() -> [SubCounty] { subCounties }
    public func getConstituencies() -> [Constituency] { constituencies }
    public func getWards() -> [Ward] { wards }
    public func getLocalities() -> [Locality] { localities }
    public func getAreas() -> [Area] { areas }

    public func getCountyByCode(_ code: String) -> County? { countiesByCode[code] }
    public func getCountyByName(_ name: String) -> County? { countiesByName[name] }

    public func getConstituencyByCode(_ code: String) -> Constituency? { constituenciesByCode[code] }
    public func getConstituencyByName(_ name: String) -> Constituency? { constituenciesByName[name] }

    public func getSubCountiesInCounty(_ countyName: String) -> [SubCounty] {
        subCounties.filter { $0.county == countyName }
    }

    public func getConstituenciesInCounty(_ countyName: String) -> [Constituency] {
        constituencies.filter { $0.county == countyName }
    }

    public func getWardsInConstituency(_ constituencyName: String) -> [Ward] {
        wards.filter { $0.constituency == constituencyName }
    }

    public func getWardsInCounty(_ countyName: String) -> [Ward] {
        let constituencyNames = Set(getConstituenciesInCounty(countyName).map { $0.name })
        return wards.filter { constituencyNames.contains($0.constituency) }
    }

    public func getLocalitiesInCounty(_ countyName: String) -> [Locality] {
        localities.filter { $0.county == countyName }
    }

    public func getAreasInLocality(_ localityName: String) -> [Area] {
        areas.filter { $0.locality == localityName }
    }

    public func getAreasInCounty(_ countyName: String) -> [Area] {
        areas.filter { $0.county == countyName }
    }

    // ─── Search ───────────────────────────────────────────────────────────────

    /// Case-insensitive substring search across all entity types.
    /// Returns up to `limit` results (default 20).
    ///
    /// - Note: This currently uses substring matching. To align with the JS
    ///   platform (Fuse.js Bitap, threshold 0.2), replace this body with the
    ///   `Ifrit` package (https://github.com/ukushu/Ifrit) using the same
    ///   threshold and `keys: ["name"]` configuration.
    ///   See TODO(search-parity) in KenyaLocations.kt for the Kotlin equivalent.
    public func search(_ query: String, limit: Int = 20) -> [SearchResult] {
        let q = query.lowercased()
        var results: [SearchResult] = []
        counties.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.county($0)) }
        subCounties.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.subCounty($0)) }
        constituencies.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.constituency($0)) }
        wards.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.ward($0)) }
        localities.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.locality($0)) }
        areas.filter { $0.name.lowercased().contains(q) }.forEach { results.append(.area($0)) }
        return Array(results.prefix(limit))
    }

    public func searchByType(_ query: String, type: SearchType, limit: Int = 20) -> [SearchResult] {
        search(query, limit: limit * 6).filter { $0.type == type }.prefix(limit).map { $0 }
    }

    // ─── Thread-safe lazy accessors ───────────────────────────────────────────

    private var counties: [County] {
        lock.lock(); defer { lock.unlock() }
        if let v = _counties { return v }
        let v: [County] = load("counties")
        _counties = v; return v
    }

    private var subCounties: [SubCounty] {
        lock.lock(); defer { lock.unlock() }
        if let v = _subCounties { return v }
        let v: [SubCounty] = load("sub-counties")
        _subCounties = v; return v
    }

    private var constituencies: [Constituency] {
        lock.lock(); defer { lock.unlock() }
        if let v = _constituencies { return v }
        let v: [Constituency] = load("constituencies")
        _constituencies = v; return v
    }

    private var wards: [Ward] {
        lock.lock(); defer { lock.unlock() }
        if let v = _wards { return v }
        let v: [Ward] = load("wards")
        _wards = v; return v
    }

    private var localities: [Locality] {
        lock.lock(); defer { lock.unlock() }
        if let v = _localities { return v }
        let v: [Locality] = load("locality")
        _localities = v; return v
    }

    private var areas: [Area] {
        lock.lock(); defer { lock.unlock() }
        if let v = _areas { return v }
        let v: [Area] = load("area")
        _areas = v; return v
    }

    private var countiesByCode: [String: County] {
        lock.lock(); defer { lock.unlock() }
        if let v = _countiesByCode { return v }
        let v = Dictionary(uniqueKeysWithValues: (_counties ?? []).map { ($0.code, $0) })
        _countiesByCode = v; return v
    }

    private var countiesByName: [String: County] {
        lock.lock(); defer { lock.unlock() }
        if let v = _countiesByName { return v }
        let v = Dictionary(uniqueKeysWithValues: (_counties ?? []).map { ($0.name, $0) })
        _countiesByName = v; return v
    }

    private var constituenciesByCode: [String: Constituency] {
        lock.lock(); defer { lock.unlock() }
        if let v = _constituenciesByCode { return v }
        let v = Dictionary(uniqueKeysWithValues: (_constituencies ?? []).map { ($0.code, $0) })
        _constituenciesByCode = v; return v
    }

    private var constituenciesByName: [String: Constituency] {
        lock.lock(); defer { lock.unlock() }
        if let v = _constituenciesByName { return v }
        let v = Dictionary(uniqueKeysWithValues: (_constituencies ?? []).map { ($0.name, $0) })
        _constituenciesByName = v; return v
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    private func load<T: Decodable>(_ resource: String) -> [T] {
        guard let url = Bundle.module.url(forResource: resource, withExtension: "json") else {
            fatalError("kenya-locations: resource '\(resource).json' not found in bundle. Make sure to run the copy-data script before building.")
        }
        do {
            let data = try Data(contentsOf: url)
            return try decoder.decode([T].self, from: data)
        } catch {
            fatalError("kenya-locations: failed to decode '\(resource).json': \(error)")
        }
    }
}
