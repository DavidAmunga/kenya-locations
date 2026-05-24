package ke.locations

import android.content.Context
import kotlinx.serialization.json.Json
import kotlinx.serialization.builtins.ListSerializer

/**
 * Main entry point for the kenya-locations Android library.
 *
 * Call [init] once (e.g. in Application.onCreate) before using any other method.
 * All data is parsed once and held in memory as Maps for O(1) lookups.
 *
 * Usage:
 * ```kotlin
 * // Application.onCreate
 * KenyaLocations.init(context)
 *
 * // Anywhere
 * val county = KenyaLocations.getCountyByCode("047")
 * val wards   = KenyaLocations.getWardsInConstituency("Westlands")
 * val results = KenyaLocations.search("karen")
 * ```
 */
object KenyaLocations {

    private val json = Json { ignoreUnknownKeys = true }

    private var _counties: List<County> = emptyList()
    private var _subCounties: List<SubCounty> = emptyList()
    private var _constituencies: List<Constituency> = emptyList()
    private var _wards: List<Ward> = emptyList()
    private var _localities: List<Locality> = emptyList()
    private var _areas: List<Area> = emptyList()

    // Fast lookup maps
    private var countiesByCode: Map<String, County> = emptyMap()
    private var countiesByName: Map<String, County> = emptyMap()
    private var constituenciesByCode: Map<String, Constituency> = emptyMap()
    private var constituenciesByName: Map<String, Constituency> = emptyMap()

    private var initialized = false

    /** Parse all JSON data from res/raw. Call once before any other method. */
    fun init(context: Context) {
        if (initialized) return

        _counties = parseRaw(context, R.raw.counties, ListSerializer(County.serializer()))
        _subCounties = parseRaw(context, R.raw.sub_counties, ListSerializer(SubCounty.serializer()))
        _constituencies = parseRaw(context, R.raw.constituencies, ListSerializer(Constituency.serializer()))
        _wards = parseRaw(context, R.raw.wards, ListSerializer(Ward.serializer()))
        _localities = parseRaw(context, R.raw.locality, ListSerializer(Locality.serializer()))
        _areas = parseRaw(context, R.raw.area, ListSerializer(Area.serializer()))

        countiesByCode = _counties.associateBy { it.code }
        countiesByName = _counties.associateBy { it.name }
        constituenciesByCode = _constituencies.associateBy { it.code }
        constituenciesByName = _constituencies.associateBy { it.name }

        initialized = true
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    fun getCounties(): List<County> = checkInit { _counties }
    fun getSubCounties(): List<SubCounty> = checkInit { _subCounties }
    fun getConstituencies(): List<Constituency> = checkInit { _constituencies }
    fun getWards(): List<Ward> = checkInit { _wards }
    fun getLocalities(): List<Locality> = checkInit { _localities }
    fun getAreas(): List<Area> = checkInit { _areas }

    fun getCountyByCode(code: String): County? = checkInit { countiesByCode[code] }
    fun getCountyByName(name: String): County? = checkInit { countiesByName[name] }

    fun getConstituencyByCode(code: String): Constituency? = checkInit { constituenciesByCode[code] }
    fun getConstituencyByName(name: String): Constituency? = checkInit { constituenciesByName[name] }

    fun getSubCountiesInCounty(countyName: String): List<SubCounty> =
        checkInit { _subCounties.filter { it.county == countyName } }

    fun getConstituenciesInCounty(countyName: String): List<Constituency> =
        checkInit { _constituencies.filter { it.county == countyName } }

    fun getWardsInConstituency(constituencyName: String): List<Ward> =
        checkInit { _wards.filter { it.constituency == constituencyName } }

    fun getWardsInCounty(countyName: String): List<Ward> = checkInit {
        val constituencies = getConstituenciesInCounty(countyName).map { it.name }.toSet()
        _wards.filter { it.constituency in constituencies }
    }

    fun getLocalitiesInCounty(countyName: String): List<Locality> =
        checkInit { _localities.filter { it.county == countyName } }

    fun getAreasInLocality(localityName: String): List<Area> =
        checkInit { _areas.filter { it.locality == localityName } }

    fun getAreasInCounty(countyName: String): List<Area> =
        checkInit { _areas.filter { it.county == countyName } }

    // ─── Search ───────────────────────────────────────────────────────────────

    /**
     * Simple case-insensitive substring search across all entity types.
     * Returns up to [limit] results (default 20).
     */
    fun search(query: String, limit: Int = 20): List<SearchResult<*>> = checkInit {
        val q = query.lowercase()
        val results = mutableListOf<SearchResult<*>>()

        _counties.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.COUNTY, it)) }
        _subCounties.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.SUB_COUNTY, it)) }
        _constituencies.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.CONSTITUENCY, it)) }
        _wards.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.WARD, it)) }
        _localities.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.LOCALITY, it)) }
        _areas.filter { it.name.lowercase().contains(q) }
            .forEach { results.add(SearchResult(SearchType.AREA, it)) }

        results.take(limit)
    }

    fun searchByType(query: String, type: SearchType, limit: Int = 20): List<SearchResult<*>> =
        search(query, limit * 6).filter { it.type == type }.take(limit)

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private fun <T> parseRaw(context: Context, resId: Int, deserializer: kotlinx.serialization.DeserializationStrategy<T>): T {
        val text = context.resources.openRawResource(resId).bufferedReader().use { it.readText() }
        return json.decodeFromString(deserializer, text)
    }

    private fun <T> checkInit(block: () -> T): T {
        check(initialized) {
            "KenyaLocations is not initialized. Call KenyaLocations.init(context) first."
        }
        return block()
    }
}
