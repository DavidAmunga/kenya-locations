# 🚀 Release Workflow with Changesets

This document explains the **manual release workflow** for kenya-locations with full control over
when releases happen and automatic contributor recognition.

## 📋 Overview

The release process is split into two stages:

1. **Automatic**: "Version Packages" PR creation (collects changesets)
2. **Manual**: Publishing to npm (you control when)

This allows you to collect multiple changesets from different contributors before releasing!

## 🔄 Complete Workflow

### Stage 1: Contributing (Automatic)

#### For Contributors

1. **Make changes** to the code/data
2. **Create a changeset**:
   ```bash
   pnpm changeset
   # Select version type (patch/minor/major)
   # Describe the changes
   ```
3. **Commit and push**:
   ```bash
   git add .changeset/*.md
   git add [your changes]
   git commit -m "feat: your feature"
   git push
   ```
4. **Create PR** and get it merged

#### What Happens Automatically

When a PR with changesets is merged to `main`:

- ✅ Workflow detects the changeset
- ✅ Creates or updates "Version Packages" PR
- ✅ Includes contributor information
- ✅ Updates version in package.json
- ✅ Generates CHANGELOG.md entries

**Note**: No publishing happens yet! Just PR creation.

### Stage 2: Collecting Changesets

You can merge **multiple PRs with changesets** before releasing:

```
Week 1: Contributor A adds feature → Merge PR
        ↓
        "Version Packages" PR created/updated

Week 2: Contributor B fixes bug → Merge PR
        ↓
        "Version Packages" PR updated with both changes

Week 3: Contributor C adds data → Merge PR
        ↓
        "Version Packages" PR updated with all 3 changes

Week 4: You're ready to release!
        ↓
        Merge "Version Packages" PR → Run publish workflow
```

### Stage 3: Review & Merge Version PR

1. **Review the "Version Packages" PR**:

   - Check the version bump is correct
   - Review CHANGELOG.md entries
   - Verify all contributors are credited
   - Ensure all changes are included

2. **Merge the PR** when ready
   - This commits the version bump to main
   - Updates CHANGELOG.md with all changes
   - Still no publishing yet!

### Stage 4: Manual Publishing

**Only you (maintainer) can trigger this:**

1. **Go to GitHub Actions**:

   ```
   https://github.com/DavidAmunga/kenya-locations/actions/workflows/publish-release.yml
   ```

2. **Click "Run workflow"**

   - Branch: `main`
   - Create release branch: ✅ (recommended)

3. **Click "Run workflow"** button

4. **Automatic steps**:
   - ✅ Runs all quality checks (lint, test, build, validate)
   - ✅ Creates release branch (e.g., `release/v0.2.0`)
   - ✅ Publishes to npm
   - ✅ Creates GitHub release with changelog
   - ✅ Credits all contributors!

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ 1. Contributor creates changeset                       │
│    $ pnpm changeset                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. PR merged to main                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. ✨ AUTOMATIC: "Version Packages" PR created/updated │
│    - Bumps version (0.1.9 → 0.2.0)                     │
│    - Updates CHANGELOG.md                               │
│    - Lists all contributors                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. More contributors? Repeat steps 1-3                 │
│    Their changes are added to same PR!                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Review & merge "Version Packages" PR                │
│    (version bump committed to main)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. 🎮 MANUAL: Run "Publish Release" workflow           │
│    Actions → Publish Release → Run workflow            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. ✨ AUTOMATIC: Publishing                            │
│    - Runs quality checks                                │
│    - Creates release branch                             │
│    - Publishes to npm                                   │
│    - Creates GitHub release                             │
│    - Credits all contributors!                          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Key Benefits

### Control Over Releases

- ✅ **Batch multiple changesets** before releasing
- ✅ **Choose when to publish** (not automatic on merge)
- ✅ **Review everything** before it goes live
- ✅ **Coordinate with team** for major releases

### Contributor Recognition

Every contributor who adds a changeset gets:

- 📝 Credit in CHANGELOG.md with GitHub link
- 🎉 Mention in GitHub release notes
- 💖 Recognition in release announcements

### Release Branches

Each release creates a branch like `release/v0.2.0`:

- 🌿 **Preserve release state** for each version
- 🔧 **Hotfix support** - create patches from release branches
- 📚 **Version history** - easy to see what was in each release

## 📁 GitHub Actions Workflows

### 1. `changesets-release.yml` - Version PR Creator

**Triggers**: Automatically when changesets are pushed to main

**What it does**:

- Creates or updates "Version Packages" PR
- Bumps version based on changesets
- Generates CHANGELOG.md entries
- Lists contributors with GitHub links

**You don't trigger this** - it's automatic!

### 2. `publish-release.yml` - Manual Publisher

**Triggers**: Only manual via workflow_dispatch

**What it does**:

- Runs all quality checks
- Creates release branch
- Publishes to npm
- Creates GitHub release
- Credits contributors

**You trigger this** when ready to release!

### 3. `ci.yml` - CI Checks

**Triggers**: Every PR and push to main

**What it does**:

- Lint, format, test, build, validate
- Ensures code quality

### 4. `version-check.yml` - Version Validation

**Triggers**: PRs that modify package.json

**What it does**:

- Skips "Version Packages" PR (automatic)
- Reminds others to use changesets

## 🛠️ Maintainer Commands

### View Pending Changesets

```bash
pnpm changeset status
```

Shows what will be in the next release.

### Preview Next Version

After changesets are added:

```bash
pnpm changeset version
```

This previews what the "Version Packages" PR will do (locally).

### Manual Publish (Local - Not Recommended)

If workflows fail, you can publish locally:

```bash
# Only use this if GitHub Actions are broken
pnpm build
pnpm changeset:publish
```

But **prefer the GitHub workflow** for proper tracking!

## 📝 Example Scenarios

### Scenario 1: Single Contributor Release

```bash
# Week 1: Contributor A
1. Creates changeset for new feature
2. PR merged → "Version Packages" PR created
3. You review and merge "Version Packages" PR
4. You manually trigger "Publish Release" workflow
✅ Released with contributor A credited!
```

### Scenario 2: Multiple Contributors

```bash
# Week 1: Contributor A
1. Adds new locality data + changeset
2. PR merged → "Version Packages" PR created

# Week 2: Contributor B
1. Fixes bug + changeset
2. PR merged → "Version Packages" PR updated

# Week 3: Contributor C
1. Adds new feature + changeset
2. PR merged → "Version Packages" PR updated

# Week 4: Release Time!
3. You review "Version Packages" PR (has all 3 changes)
4. Merge "Version Packages" PR
5. Trigger "Publish Release" workflow
✅ Released with ALL 3 contributors credited!
```

### Scenario 3: Emergency Hotfix

```bash
1. Critical bug found in v0.2.0
2. Create hotfix from release branch:
   git checkout release/v0.2.0
   git checkout -b hotfix/critical-bug
3. Fix bug + create changeset (patch)
4. PR to main → merge
5. "Version Packages" PR shows v0.2.0 → v0.2.1
6. Merge and publish immediately
✅ Hotfix released!
```

## 🎬 Quick Reference

### For Contributors

```bash
# 1. Make changes
# 2. Create changeset
pnpm changeset

# 3. Commit & push
git add .
git commit -m "feat: description"
git push
```

### For Maintainers

```bash
# Review "Version Packages" PR
# If good → merge it

# Then go to GitHub:
Actions → Publish Release → Run workflow
```

## ⚙️ Configuration

### Changesets Config

Located in `.changeset/config.json`:

```json
{
  "changelog": [
    "@changesets/changelog-github",
    {
      "repo": "DavidAmunga/kenya-locations"
    }
  ],
  "access": "public"
}
```

This enables GitHub-powered changelogs with contributor links!

### Workflow Permissions

Both workflows need:

- `contents: write` - For creating branches and releases
- `pull-requests: write` - For creating "Version Packages" PR
- `id-token: write` - For npm publishing with provenance

## 🔒 Security

- **NPM_TOKEN** required for publishing (set in repo secrets)
- Only maintainers can trigger "Publish Release" workflow
- All quality checks must pass before publishing
- Release branches preserve audit trail

## 📊 Monitoring

### Check Workflow Status

```
https://github.com/DavidAmunga/kenya-locations/actions
```

### Check npm Package

```
https://www.npmjs.com/package/kenya-locations
```

### Check GitHub Releases

```
https://github.com/DavidAmunga/kenya-locations/releases
```

## 💡 Pro Tips

1. **Batch related changes** - Wait for multiple PRs before releasing
2. **Review changesets** in PRs - Ensure descriptions are clear
3. **Test locally** before triggering publish workflow
4. **Use release branches** for hotfixes
5. **Announce releases** - Thank contributors publicly!

## 🎉 Summary

**Automatic**: "Version Packages" PR creation  
**Manual**: Publishing to npm

This gives you **full control** while still automating the boring parts!

All contributors are automatically recognized in changelogs and releases. 🎊

---

**Questions?** Open a discussion or check [CONTRIBUTING.md](../CONTRIBUTING.md)
