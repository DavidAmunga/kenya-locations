# Android example

A small Compose app that uses the **local Kotlin library** (`packages/kotlin`) — county → constituency → ward, plus search.

This example does **not** publish to Maven. It composite-builds `packages/kotlin` so library changes show up on the next run.

## Run

Android Studio: open `examples/android`.

```bash
cd examples/android
./gradlew :app:installDebug
```

Requires JDK 17+ and the Android SDK (`ANDROID_HOME`).

## Use the published artifact instead

In a real app, drop the subproject include and depend on Maven Central:

```kotlin
dependencies {
    implementation("io.github.davidamunga:kenya-locations:0.9.0")
}
```

No Android Context or init call — `KenyaLocations.getCounties()` reads JSON from the JAR on first access.
