package ke.locations

import kotlinx.serialization.Serializable

@Serializable
data class County(val code: String, val name: String)

@Serializable
data class SubCounty(val code: String, val name: String, val county: String)

@Serializable
data class Constituency(val code: String, val name: String, val county: String)

@Serializable
data class Ward(val code: String, val name: String, val constituency: String)

@Serializable
data class Locality(val name: String, val county: String)

@Serializable
data class Area(val name: String, val locality: String, val county: String)

enum class SearchType { COUNTY, SUB_COUNTY, CONSTITUENCY, WARD, LOCALITY, AREA }

data class SearchResult<T>(val type: SearchType, val item: T)
