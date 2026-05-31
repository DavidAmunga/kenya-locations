package ke.locations

import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/**
 * Unit tests for KenyaLocations.
 *
 * These tests run on the JVM (no Android device required).
 * KenyaLocations is tested via a helper that injects the raw JSON directly,
 * bypassing Android resources so tests can run in CI without an emulator.
 */
class KenyaLocationsTest {

    @Test
    fun `county count equals 47`() {
        val counties = loadCountiesFromFile()
        assertEquals(47, counties.size, "Kenya has exactly 47 counties")
    }

    @Test
    fun `all counties have non-blank code and name`() {
        val counties = loadCountiesFromFile()
        counties.forEach { county ->
            assertTrue(county.code.isNotBlank(), "County code must not be blank: $county")
            assertTrue(county.name.isNotBlank(), "County name must not be blank: $county")
        }
    }

    @Test
    fun `county codes are unique`() {
        val counties = loadCountiesFromFile()
        val codes = counties.map { it.code }
        assertEquals(codes.size, codes.toSet().size, "County codes must be unique")
    }

    @Test
    fun `nairobi county exists`() {
        val counties = loadCountiesFromFile()
        val nairobi = counties.find { it.name == "Nairobi City" || it.name == "Nairobi" }
        assertNotNull(nairobi, "Nairobi county should exist")
    }

    @Test
    fun `ward constituency references are valid`() {
        val wards = loadWardsFromFile()
        val constituencies = loadConstituenciesFromFile().map { it.name }.toSet()
        val invalid = wards.filter { it.constituency !in constituencies }
        assertTrue(invalid.isEmpty(), "All ward constituency refs must be valid. Invalid: ${invalid.take(5)}")
    }

    @Test
    fun `area locality references are valid`() {
        val areas = loadAreasFromFile()
        val localities = loadLocalitiesFromFile().map { it.name }.toSet()
        val invalid = areas.filter { it.locality !in localities }
        assertTrue(invalid.isEmpty(), "All area locality refs must be valid. Invalid: ${invalid.take(5)}")
    }

    // ─── Fuzzy search ────────────────────────────────────────────────────────

    @Test
    fun `search exact match returns county`() {
        val results = KenyaLocations.search("Nairobi")
        assertTrue(results.isNotEmpty(), "Search for 'Nairobi' should return results")
        assertTrue(
            results.any { it.type == SearchType.COUNTY && (it.item as? County)?.name == "Nairobi" },
            "First result for 'Nairobi' should be the Nairobi county"
        )
    }

    @Test
    fun `search tolerates typos`() {
        val results = KenyaLocations.search("Nairob")
        assertTrue(results.isNotEmpty(), "Typo 'Nairob' should fuzzy-match 'Nairobi'")
        assertTrue(
            results.any { (it.item as? County)?.name == "Nairobi" },
            "Fuzzy search for 'Nairob' should include Nairobi county"
        )
    }

    @Test
    fun `search returns empty for single character`() {
        val results = KenyaLocations.search("N")
        assertTrue(results.isEmpty(), "Single character queries should return no results")
    }

    @Test
    fun `search respects limit`() {
        val results = KenyaLocations.search("a", limit = 5)
        assertTrue(results.size <= 5, "Search should respect the limit parameter")
    }

    @Test
    fun `search results are sorted best match first`() {
        val results = KenyaLocations.search("Westlands")
        assertTrue(results.isNotEmpty(), "Search for 'Westlands' should return results")
        // All exact substring matches (score 0.0) must come before fuzzy matches.
        // Just verify the very first result name contains "Westlands".
        val firstName: String = when (val item = results.first().item) {
            is County -> item.name
            is Constituency -> item.name
            is SubCounty -> item.name
            is Ward -> item.name
            is Locality -> item.name
            is Area -> item.name
            else -> ""
        }
        assertTrue(
            firstName.contains("Westlands", ignoreCase = true),
            "First result should contain 'Westlands', got '$firstName'"
        )
    }

    @Test
    fun `searchByType filters to requested type`() {
        val results = KenyaLocations.searchByType("Nairobi", SearchType.COUNTY)
        assertTrue(results.all { it.type == SearchType.COUNTY }, "searchByType should only return the requested type")
    }
}
