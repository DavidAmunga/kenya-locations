import Foundation

public struct County: Codable, Equatable, Hashable, Sendable {
    public let code: String
    public let name: String
}

public struct SubCounty: Codable, Equatable, Hashable, Sendable {
    public let code: String
    public let name: String
    public let county: String
}

public struct Constituency: Codable, Equatable, Hashable, Sendable {
    public let code: String
    public let name: String
    public let county: String
}

public struct Ward: Codable, Equatable, Hashable, Sendable {
    public let code: String
    public let name: String
    public let constituency: String
}

public struct Locality: Codable, Equatable, Hashable, Sendable {
    public let name: String
    public let county: String
}

public struct Area: Codable, Equatable, Hashable, Sendable {
    public let name: String
    public let locality: String
    public let county: String
}

public enum SearchType: String, CaseIterable, Sendable {
    case county
    case subCounty
    case constituency
    case ward
    case locality
    case area
}

public enum SearchResult: Sendable {
    case county(County)
    case subCounty(SubCounty)
    case constituency(Constituency)
    case ward(Ward)
    case locality(Locality)
    case area(Area)

    public var type: SearchType {
        switch self {
        case .county: return .county
        case .subCounty: return .subCounty
        case .constituency: return .constituency
        case .ward: return .ward
        case .locality: return .locality
        case .area: return .area
        }
    }
}
