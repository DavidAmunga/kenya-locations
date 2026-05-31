package ke.locations

import kotlinx.serialization.Serializable

enum class CountyRegion {
    NAIROBI, CENTRAL, COAST, EASTERN, NORTH_EASTERN, NYANZA, RIFT_VALLEY, WESTERN;

    companion object {
        fun fromString(value: String): CountyRegion = when (value) {
            "Nairobi" -> NAIROBI
            "Central" -> CENTRAL
            "Coast" -> COAST
            "Eastern" -> EASTERN
            "North Eastern" -> NORTH_EASTERN
            "Nyanza" -> NYANZA
            "Rift Valley" -> RIFT_VALLEY
            "Western" -> WESTERN
            else -> throw IllegalArgumentException("Unknown region: $value")
        }
    }
}

@Serializable
data class County(
    val code: String,
    val name: String,
    val capital: String,
    val area_km2: Double,
    val population_2019: Long,
    val region: String,
    val postal_code: String
)

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
