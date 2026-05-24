#!/usr/bin/env node

/**
 * sync-swift-version.js
 *
 * After `changeset version` bumps packages/swift/package.json,
 * this script is a no-op for now because Swift Package Manager uses
 * git tags for versioning — no separate version file to update.
 *
 * The version in packages/swift/package.json serves as the canonical
 * reference for changesets so all packages stay in lock-step.
 *
 * Run automatically via: pnpm changeset:version (see root package.json)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const swiftPkgPath = join(__dirname, "../packages/swift/package.json");
const { version } = JSON.parse(readFileSync(swiftPkgPath, "utf8"));

console.log(`✅ Swift package version: ${version} (published via git tag — no extra file to sync)`);
