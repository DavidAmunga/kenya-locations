plugins {
    id("com.android.library") version "8.7.3"
    id("org.jetbrains.kotlin.android") version "2.1.0"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.0"
    id("com.vanniktech.maven.publish") version "0.30.0"
}

android {
    namespace = "ke.locations"
    compileSdk = 35

    defaultConfig {
        minSdk = 21
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test:2.1.0")
}

// ─── Copy shared JSON data from /data into res/raw before every build ─────────
val dataDir = rootProject.file("../../data")

tasks.register<Copy>("copyLocationData") {
    description = "Copy shared JSON data files into Android res/raw"
    from(dataDir) {
        include("*.json")
        // Android resource names must be lowercase with no hyphens
        rename("sub-counties.json", "sub_counties.json")
    }
    into("src/main/res/raw")
}

tasks.named("preBuild") {
    dependsOn("copyLocationData")
}

tasks.named("clean") {
    doLast {
        delete(fileTree("src/main/res/raw") { include("*.json") })
    }
}

// ─── Maven Central publishing (via com.vanniktech.maven.publish) ──────────────
mavenPublishing {
    publishToMavenCentral(com.vanniktech.maven.publish.SonatypeHost.CENTRAL_PORTAL)
    signAllPublications()

    coordinates(
        groupId = "io.github.davidamunga",
        artifactId = "kenya-locations-android",
        version = providers.gradleProperty("VERSION_NAME").get()
    )

    pom {
        name.set("kenya-locations-android")
        description.set("Kenyan administrative divisions for Android — counties, constituencies, wards, sub-counties, localities and areas.")
        url.set("https://github.com/DavidAmunga/kenya-locations")
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
            url.set("https://github.com/DavidAmunga/kenya-locations")
            connection.set("scm:git:git://github.com/DavidAmunga/kenya-locations.git")
            developerConnection.set("scm:git:ssh://git@github.com/DavidAmunga/kenya-locations.git")
        }
    }
}
