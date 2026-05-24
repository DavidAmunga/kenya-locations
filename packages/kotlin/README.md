# kenya-locations — JVM/Kotlin library

Kotlin/JVM library for Kenyan administrative divisions. Works on **Android, Spring Boot, Ktor, CLI tools, and any JVM project** — no Android SDK required.

Published on Maven Central as `io.github.davidamunga:kenya-locations`.

## Installation

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.davidamunga:kenya-locations:0.5.0")
}
```

No extra setup needed. Data is loaded lazily from the JAR's classpath on first access.

## Usage

### Kotlin
```kotlin
val counties      = KenyaLocations.getCounties()
val wards         = KenyaLocations.getWardsInConstituency("Westlands")
val localities    = KenyaLocations.getLocalitiesInCounty("Nairobi City")
val searchResults = KenyaLocations.search("karen")
```

### Java
```java
List<County> counties = KenyaLocations.INSTANCE.getCounties();
List<Ward>   wards    = KenyaLocations.INSTANCE.getWardsInConstituency("Westlands");
```

### Android (no init() needed)
```kotlin
// Just call directly — no Application.onCreate setup required
val areas = KenyaLocations.getAreasInLocality("Karen")
```

### Spring Boot
```kotlin
@Service
class LocationService {
    fun search(q: String) = KenyaLocations.search(q)
}
```

---

## Local development

### Prerequisites

| Tool | Install |
|------|---------|
| JDK 17 | `brew install --cask temurin@17` or via [Adoptium](https://adoptium.net) |

No Android Studio or Android SDK needed.

### Run tests

```bash
cd packages/kotlin
./gradlew build        # copies data, compiles, runs tests
./gradlew test         # tests only
```

### Build the JAR

```bash
./gradlew build
# Output: build/libs/kenya-locations-0.5.0.jar
```

---

## Publishing to Maven Central (one-time setup)

See the [one-time setup guide](../../packages/kotlin/README.md) for GPG key and Sonatype account instructions.

After setup, publish via GitHub Actions:

```
GitHub → Actions → "Publish Kotlin to Maven Central" → Run workflow → enter version
```

---

## Package structure

```
packages/kotlin/
├── build.gradle.kts                         ← JVM library + Maven Central config
├── gradle.properties                        ← VERSION_NAME, GROUP, POM_ARTIFACT_ID
├── src/
│   ├── main/
│   │   ├── kotlin/ke/locations/
│   │   │   ├── Models.kt                    ← County, Ward, Area … data classes
│   │   │   └── KenyaLocations.kt            ← main singleton API
│   │   └── resources/                       ← JSON files copied here by Gradle
│   └── test/kotlin/ke/locations/
│       ├── KenyaLocationsTest.kt            ← JVM unit tests
│       └── TestHelpers.kt                   ← reads JSON from ../../data/ directly
└── gradle/wrapper/
```
