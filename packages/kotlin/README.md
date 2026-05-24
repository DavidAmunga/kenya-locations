# kenya-locations — Android library

Kotlin/Android library for Kenyan administrative divisions. 

Published on Maven Central as `io.github.davidamunga:kenya-locations-android`.

## Installation

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.github.davidamunga:kenya-locations-android:0.4.0")
}
```

## Usage

```kotlin
// Application.onCreate — initialise once
KenyaLocations.init(this)

// Anywhere in your app
val counties      = KenyaLocations.getCounties()
val wards         = KenyaLocations.getWardsInConstituency("Westlands")
val localities    = KenyaLocations.getLocalitiesInCounty("Nairobi City")
val searchResults = KenyaLocations.search("karen")
```

---

## Local development

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Android Studio | Ladybug 2024.2+ | [developer.android.com/studio](https://developer.android.com/studio) |
| JDK | 17 | bundled with Android Studio |
| Android SDK | API 35 | Android Studio SDK Manager |

### Run tests (no device needed)

```bash
cd packages/kotlin
./gradlew copyLocationData   # pull JSON from ../../data/ into res/raw
./gradlew test               # JVM unit tests, no emulator required
```

### Build the AAR

```bash
./gradlew assembleRelease
# Output: build/outputs/aar/library-release.aar
```

---

## Publishing to Maven Central (one-time setup)

### Step 1 — Create a Sonatype account

Go to [central.sonatype.com](https://central.sonatype.com) and sign up.

### Step 2 — Claim the namespace `io.github.davidamunga`

In your Sonatype dashboard → **Namespaces** → **Add namespace** → type `io.github.davidamunga`.

Sonatype will show a verification token (a random string like `ABCD1234`). Create a **public GitHub repository** named exactly that string on your account (e.g. `github.com/DavidAmunga/ABCD1234`). Back in Sonatype, click **Verify Namespace**. You can delete the repo afterwards.

### Step 3 — Generate a GPG signing key

```bash
# Generate a new key
gpg --gen-key
# Use your real name and email. Remember the passphrase.

# Get the key ID (last 8 chars of the fingerprint)
gpg --list-secret-keys --keyid-format SHORT
# Example output:
# sec   rsa4096/A1B2C3D4  ...
#                ^^^^^^^^ this is your GPG_KEY_ID

# Upload the public key to a keyserver so Maven Central can verify it
gpg --keyserver keyserver.ubuntu.com --send-keys A1B2C3D4

# Export the private key as base64 (this is your GPG_KEY secret)
gpg --export-secret-keys --armor A1B2C3D4 | base64 | pbcopy
```

### Step 4 — Add secrets to your GitHub repository

Go to your repo → **Settings → Secrets and variables → Actions** → add these five secrets:

| Secret name | Value |
|---|---|
| `SONATYPE_USERNAME` | Your Sonatype username (shown in central.sonatype.com profile) |
| `SONATYPE_PASSWORD` | Your Sonatype password |
| `GPG_KEY_ID` | Last 8 chars of your GPG fingerprint (e.g. `A1B2C3D4`) |
| `GPG_KEY_PASSWORD` | The passphrase you set when generating the key |
| `GPG_KEY` | The base64-encoded private key from the `gpg --export` command above |

### Step 5 — Publish

In GitHub → **Actions → Publish Kotlin to Maven Central → Run workflow** → enter the version number → click **Run workflow**.

The workflow will:
1. Validate all JSON data
2. Copy data into `res/raw`
3. Build and test the AAR
4. Sign artifacts with your GPG key
5. Upload to Sonatype Central Portal
6. Automatically release (no manual staging needed)
7. Create a GitHub release tag

The library appears on [central.sonatype.com](https://central.sonatype.com/artifact/io.github.davidamunga/kenya-locations-android) within ~10 minutes, and on `search.maven.org` within ~2 hours.

---

## Package structure

```
packages/kotlin/
├── build.gradle.kts                         ← Android library + Maven Central config
├── gradle.properties                        ← VERSION_NAME, GROUP, POM_ARTIFACT_ID
├── src/
│   ├── main/kotlin/ke/locations/
│   │   ├── Models.kt                        ← County, Ward, Area … data classes
│   │   └── KenyaLocations.kt               ← main singleton API
│   └── test/kotlin/ke/locations/
│       ├── KenyaLocationsTest.kt            ← JVM unit tests
│       └── TestHelpers.kt                   ← reads JSON from ../../data/ directly
└── gradle/wrapper/
```
