# Flutter example

A small Flutter app with the same county picker and search as the Android example.

Dart cannot import the Java/Kotlin JAR. This example **reads the shared JSON** in `data/` (copied into `assets/data/`) through `lib/kenya_locations.dart`.

## Run

From the monorepo root:

```bash
cd examples/flutter
chmod +x tool/sync_data.sh && ./tool/sync_data.sh
flutter pub get
flutter run
```

After `data/` changes, re-run `./tool/sync_data.sh` so the assets stay in sync.

If the simulator still shows the old counter, **hot restart** (capital `R`), or stop and `flutter run` again from this folder.
