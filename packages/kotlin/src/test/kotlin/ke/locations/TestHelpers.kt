package ke.locations

import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import java.io.File

private val json = Json { ignoreUnknownKeys = true }
private val dataDir = File("../../data")

private fun <T> loadJson(filename: String, deserializer: kotlinx.serialization.DeserializationStrategy<List<T>>): List<T> {
    val file = dataDir.resolve(filename)
    require(file.exists()) { "Data file not found: ${file.absolutePath}" }
    return json.decodeFromString(deserializer, file.readText())
}

fun loadCountiesFromFile() = loadJson("counties.json", ListSerializer(County.serializer()))
fun loadConstituenciesFromFile() = loadJson("constituencies.json", ListSerializer(Constituency.serializer()))
fun loadWardsFromFile() = loadJson("wards.json", ListSerializer(Ward.serializer()))
fun loadSubCountiesFromFile() = loadJson("sub-counties.json", ListSerializer(SubCounty.serializer()))
fun loadLocalitiesFromFile() = loadJson("locality.json", ListSerializer(Locality.serializer()))
fun loadAreasFromFile() = loadJson("area.json", ListSerializer(Area.serializer()))
