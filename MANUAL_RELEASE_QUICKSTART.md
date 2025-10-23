# 🎮 Manual Release Quick Start

## ✨ What's Different Now

**Before**: Releases happened automatically when PRs were merged  
**Now**: You control when releases happen (manual workflow trigger)

**Why?** So you can collect changesets from multiple contributors before releasing!

## 📋 Two-Stage Release Process

### Stage 1: Automatic (Collecting Changesets)

Contributors create changesets → PRs are merged → "Version Packages" PR is created/updated

**You don't do anything here!** Just review and merge contributor PRs as usual.

### Stage 2: Manual (Publishing)

When you're ready to release:

1. Merge "Version Packages" PR
2. Go to GitHub Actions
3. Trigger "Publish Release" workflow
4. Done! 🎉

## 🚀 Step-by-Step Release

### 1. Check What's Ready to Release

```bash
# See pending changesets
pnpm changeset status
```

### 2. Review "Version Packages" PR

Go to your GitHub repo → Pull Requests → Look for:

```
chore: version packages
```

**Check**:

- ✅ Version bump is correct (e.g., 0.1.9 → 0.2.0)
- ✅ CHANGELOG.md includes all changes
- ✅ All contributors are credited
- ✅ Everything looks good!

### 3. Merge "Version Packages" PR

Click "Merge pull request" → Confirm

This commits the version bump to main (but doesn't publish yet!)

### 4. Trigger Manual Publish

Go to:

```
Actions → Publish Release → Run workflow
```

Options:

- **Branch**: `main` (default)
- **Create release branch**: ✅ (recommended)

Click: **"Run workflow"**

### 5. Monitor the Release

Watch the workflow run:

- ✅ Quality checks (lint, test, build, validate)
- ✅ Create release branch (`release/v0.2.0`)
- ✅ Publish to npm
- ✅ Create GitHub release
- ✅ Credit contributors

### 6. Verify Publication

- 📦 Check npm: https://www.npmjs.com/package/kenya-locations
- 🎉 Check GitHub releases: https://github.com/DavidAmunga/kenya-locations/releases
- 🌿 Check release branch was created

## 📊 Example Scenarios

### Scenario 1: Single Contributor

```
Mon: Contributor adds feature → Merge PR
     ↓
     "Version Packages" PR created

Tue: You review → Merge "Version Packages" PR
     ↓
     Go to Actions → Run "Publish Release"
     ↓
     ✅ Published!
```

### Scenario 2: Multiple Contributors (Recommended!)

```
Week 1:
Mon: Contributor A adds data → Merge PR
     → "Version Packages" PR created

Wed: Contributor B fixes bug → Merge PR
     → "Version Packages" PR UPDATED

Fri: Contributor C adds feature → Merge PR
     → "Version Packages" PR UPDATED

Week 2:
Mon: Review "Version Packages" PR
     → See all 3 changes!
     → Merge "Version Packages" PR
     → Run "Publish Release" workflow
     → ✅ All 3 contributors credited!
```

## 🎯 GitHub Actions Links

### View "Version Packages" PR

```
https://github.com/DavidAmunga/kenya-locations/pulls
```

Look for PR titled: **"chore: version packages"**

### Trigger Manual Publish

```
https://github.com/DavidAmunga/kenya-locations/actions/workflows/publish-release.yml
```

Click: **"Run workflow"** button

### Monitor Workflows

```
https://github.com/DavidAmunga/kenya-locations/actions
```

## ⚙️ Workflows Overview

### 1. CI (Automatic)

- **File**: `.github/workflows/ci.yml`
- **Runs**: Every PR and push to main
- **Does**: Lint, test, build, validate

### 2. Changesets - Version PR (Automatic)

- **File**: `.github/workflows/changesets-release.yml`
- **Runs**: When changesets are pushed to main
- **Does**: Creates/updates "Version Packages" PR

### 3. Publish Release (Manual - YOU TRIGGER)

- **File**: `.github/workflows/publish-release.yml`
- **Runs**: Only when you manually trigger it
- **Does**: Publishes to npm, creates GitHub release

### 4. Version Check (Automatic)

- **File**: `.github/workflows/version-check.yml`
- **Runs**: On PRs modifying package.json
- **Does**: Reminds contributors to use changesets

## 🐛 Troubleshooting

### "Version Packages" PR Not Created

**Problem**: Merged a PR with changeset but no "Version Packages" PR appeared

**Solution**:

1. Check Actions tab for errors
2. Verify changeset file is in `.changeset/`
3. Check workflow ran successfully

### Publish Workflow Failed

**Problem**: Manual publish workflow failed

**Solutions**:

1. Check NPM_TOKEN is set correctly in secrets
2. Check all quality checks passed
3. Review workflow logs for specific error
4. Try again after fixing

### Wrong Version Bump

**Problem**: Version bump is incorrect (should be minor not patch)

**Solution**:

1. Don't merge "Version Packages" PR yet
2. Check changesets - they determine version bump:
   - `patch` → 0.1.9 → 0.1.10
   - `minor` → 0.1.9 → 0.2.0
   - `major` → 0.1.9 → 1.0.0
3. If wrong, create new changeset with correct type

## 💡 Pro Tips

1. **Batch releases** - Wait for multiple contributors before releasing
2. **Review carefully** - Check CHANGELOG.md in "Version Packages" PR
3. **Test first** - Run `pnpm prepare-release` locally before triggering workflow
4. **Communication** - Let contributors know when you're planning a release
5. **Celebrate** - Thank contributors in release announcements!

## 📝 Maintainer Checklist

Before releasing:

- [ ] Review all changesets in "Version Packages" PR
- [ ] Check version bump is correct (patch/minor/major)
- [ ] Verify CHANGELOG.md entries are clear
- [ ] Ensure all contributors are credited
- [ ] Check CI passed on main branch
- [ ] Run local tests if unsure
- [ ] Merge "Version Packages" PR
- [ ] Trigger "Publish Release" workflow
- [ ] Verify npm package published
- [ ] Check GitHub release created
- [ ] Announce release to community! 🎉

## 🔗 Full Documentation

For complete details, see:

- **[RELEASE_WORKFLOW.md](.github/RELEASE_WORKFLOW.md)** - Complete workflow documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## 🎉 Summary

**Automatic**: "Version Packages" PR creation (collects changesets)  
**Manual**: Publishing to npm (you control timing)

This gives you full control while recognizing all contributors! 🚀

---

**Quick Links**:

- [View Workflows](https://github.com/DavidAmunga/kenya-locations/actions)
- [Trigger Publish](https://github.com/DavidAmunga/kenya-locations/actions/workflows/publish-release.yml)
- [View Releases](https://github.com/DavidAmunga/kenya-locations/releases)
- [npm Package](https://www.npmjs.com/package/kenya-locations)
