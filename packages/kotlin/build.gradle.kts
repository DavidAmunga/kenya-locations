plugins {
    kotlin("jvm") version "2.1.0"
    kotlin("plugin.serialization") version "2.1.0"
    id("com.vanniktech.maven.publish") version "0.30.0"
}

kotlin {
    jvmToolchain(17)
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test:2.1.0")
}

// ─── Copy shared JSON data into src/main/resources before every build ─────────
val dataDir = rootProject.file("../../data")

tasks.register<Copy>("copyLocationData") {
    description = "Copy shared JSON data files into JVM classpath resources"
    from(dataDir) { include("*.json") }
    into("src/main/resources")
}

tasks.named("processResources") {
    dependsOn("copyLocationData")
}

// sourcesJar is created by the vanniktech plugin — wire the dependency safely
tasks.matching { it.name == "sourcesJar" }.configureEach {
    dependsOn("copyLocationData")
}

tasks.named("clean") {
    doLast {
        delete(fileTree("src/main/resources") { include("*.json") })
    }
}

// ─── Maven Central publishing ──────────────────────────────────────────────────
mavenPublishing {
    publishToMavenCentral(com.vanniktech.maven.publish.SonatypeHost.CENTRAL_PORTAL)
    signAllPublications()

    coordinates(
        groupId = "io.github.davidamunga",
        artifactId = "kenya-locations",
        version = providers.gradleProperty("VERSION_NAME").get()
    )

    pom {
        name.set("kenya-locations")
        description.set("Kenyan administrative divisions for counties, constituencies, wards, sub-counties, localities and areas. Works on Android, Spring Boot, CLI tools, and any JVM project.")
        url.set("https://github.com/davidamunga/kenya-locations")
        inceptionYear.set("2024")

        licenses {
            license {
                name.set("MIT License")
                url.set("https://opensource.org/licenses/MIT")
                distribution.set("repo")
            }
        }

        developers {
            developer {
                id.set("davidamunga")
                name.set("David Amunga")
                url.set("https://davidamunga.com")
            }
        }

        scm {
            url.set("https://github.com/davidamunga/kenya-locations")
            connection.set("scm:git:git://github.com/davidamunga/kenya-locations.git")
            developerConnection.set("scm:git:ssh://git@github.com/davidamunga/kenya-locations.git")
        }
    }
}
