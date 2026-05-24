package ke.locations

import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json

/**
 * Main entry point for the kenya-locations library.
 *
 * Works on Android, Spring Boot, Ktor, CLI tools, or any Java project —
 * no Android Context or special initialisation required.
 *
 * Data is parsed lazily on first access and cached for the lifetime of the process.
 *
 * Usage:
 * ```kotlin
 * val counties  = KenyaLocations.getCounties()
 * val wards     = KenyaLocations.getWardsInConstituency("Westlands")
 * val results   = KenyaLocations.search("karen")
 * ```
 */
object KenyaLocations {

    private val json = Json { ignoreUnknownKeys = true }

    // ─── Lazy-loaded data (each file parsed only when first accessed) ──────────

    private val _counties: List<County> by lazy {
        loadList("counties.json", ListSerializer(County.serializer()))
    }
    private val _subCounties: List<SubCounty> by lazy {
        loadList("sub-counties.json", ListSerializer(SubCounty.serializer()))
    }
    private val _constituencies: List<Constituency> by lazy {
        loadList("constituencies.json", ListSerializer(Constituency.serializer()))
    }
    private val _wards: List<Ward> by lazy {
        loadList("wards.json", ListSerializer(Ward.serializer()))
    }
    private val _localities: List<Locality> by lazy {
        loadList("locality.json", ListSerializer(Locality.serializer()))
    }
    private val _areas: List<Area> by lazy {
        loadList("area.json", ListSerializer(Area.serializer()))
    }

    // Fast lookup maps — also lazy
    private val countiesByCode: Map<String, County> by lazy { _counties.associateBy { it.code } }
    private val countiesByName: Map<String, County> by lazy { _counties.associateBy { it.name } }
    private val constituenciesByCode: Map<String, Constituency> by lazy { _constituencies.associateBy { it.code } }
    private val constituenciesByName: Map<String, Constituency> by lazy { _constituencies.associateBy { it.name } }

    // ─── Getters ──────────────────────────────────────────────────────────────

    fun getCounties(): List<County> = _counties
    fun getSubCounties(): List<SubCounty> = _subCounties
    fun getConstituencies(): List<Constituency> = _constituencies
    fun getWards(): List<Ward> = _wards
    fun getLocalities(): List<Locality> = _localities
    fun getAreas(): List<Area> = _areas

    fun getCountyByCode(code: String): County? = countiesByCode[code]
    fun getCountyByName(name: String): County? = countiesByName[name]

    fun getConstituencyByCode(code: String): Constituency? = constituenciesByCode[code]
    fun getConstituencyByName(name: String): Constituency? = constituenciesByName[name]

    fun getSubCountiesInCounty(countyName: String): List<SubCounty> =
        _subCounties.filter { it.county == countyName }

    fun getConstituenciesInCounty(countyName: String): List<Constituency> =
        _constituencies.filter { it.county == countyName }

    fun getWardsInConstituency(constituencyName: String): List<Ward> =
        _wards.filter { it.constituency == constituencyName }

    fun getWardsInCounty(countyName: String): List<Ward> {
        val constituencyNames = getConstituenciesInCounty(countyName).map { it.name }.toSet()
        return _wards.filter { it.constituency in constituencyNames }
    }

    fun getLocalitiesInCounty(countyName: String): List<Locality> =
        _localities.filter { it.county == countyName }

    fun getAreasInLocality(localityName: String): List<Area> =
        _areas.filter { it.locality == localityName }

    fun getAreasInCounty(countyName: String): List<Area> =
        _areas.filter { it.county == countyName }

    // ─── Search ───────────────────────────────────────────────────────────────

    /**
     * Case-insensitive substring search across all entity types.
     * Returns up to [limit] results (default 20).
     */
    fun search(query: String, limit: Int = 20): List<SearchResult<*>> {
        val q = query.lowercase()
        return buildList {
            _counties.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.COUNTY, it)) }
            _subCounties.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.SUB_COUNTY, it)) }
            _constituencies.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.CONSTITUENCY, it)) }
            _wards.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.WARD, it)) }
            _localities.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.LOCALITY, it)) }
            _areas.filter { it.name.lowercase().contains(q) }
                .forEach { add(SearchResult(SearchType.AREA, it)) }
        }.take(limit)
    }

    fun searchByType(query: String, type: SearchType, limit: Int = 20): List<SearchResult<*>> =
        search(query, limit * 6).filter { it.type == type }.take(limit)

    // ─── Internal ─────────────────────────────────────────────────────────────

    private fun <T> loadList(resource: String, deserializer: kotlinx.serialization.DeserializationStrategy<T>): T {
        val stream = KenyaLocations::class.java.getResourceAsStream("/$resource")
            ?: error("kenya-locations: classpath resource '/$resource' not found. Make sure the library JAR is on the classpath.")
        return stream.bufferedReader().use { json.decodeFromString(deserializer, it.readText()) }
    }
}
