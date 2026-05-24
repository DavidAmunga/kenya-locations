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
}
