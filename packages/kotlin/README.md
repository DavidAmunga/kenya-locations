# kenya-locations — Kotlin/JVM

See the [root README](../../README.md) for full documentation, API reference, and installation instructions.

An Android Compose example that includes this library as a Gradle subproject lives in [`examples/android`](../../examples/android).

## Local development

```bash
./gradlew build   # copies data from ../../data/, compiles, runs tests
./gradlew test    # tests only
```

## Publishing

Handled via GitHub Actions — see `.github/workflows/publish-kotlin.yml`.
Run from the `release/vX.Y.Z` branch after merging a Version PR.
