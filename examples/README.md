# Examples

Runnable apps that show the same county picker and search as the docs site.

| Path | What it uses |
| --- | --- |
| [`android/`](android/) | Native Compose app using the Kotlin/JVM library (`packages/kotlin`) |
| [`flutter/`](flutter/) | Flutter app reading shared JSON in `data/` |

```bash
# Native Android (Kotlin library)
cd examples/android && ./gradlew :app:installDebug

# Flutter (JSON assets)
cd examples/flutter && flutter run
```

JavaScript usage is in [`packages/js/examples/basic-usage.html`](../packages/js/examples/basic-usage.html). The live web demo is [`apps/web`](../apps/web).
