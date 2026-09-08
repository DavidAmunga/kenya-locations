pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "kenya-locations-android-example"

include(":app")

includeBuild("../../packages/kotlin") {
    dependencySubstitution {
        substitute(module("io.github.davidamunga:kenya-locations"))
            .using(project(":"))
    }
}
