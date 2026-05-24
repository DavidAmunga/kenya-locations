#!/usr/bin/env node

/**
 * sync-kotlin-version.js
 *
 * After `changeset version` bumps packages/kotlin/package.json,
 * this script writes the new version back into gradle.properties
 * so both files stay in sync.
 *
 * Run automatically via: pnpm changeset:version (see root package.json)
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const kotlinPkgPath = join(__dirname, "../packages/kotlin/package.json");
const gradlePropsPath = join(__dirname, "../packages/kotlin/gradle.properties");

const { version } = JSON.parse(readFileSync(kotlinPkgPath, "utf8"));
const props = readFileSync(gradlePropsPath, "utf8").replace(
  /^VERSION_NAME=.*/m,
  `VERSION_NAME=${version}`
);

writeFileSync(gradlePropsPath, props);
console.log(`✅ Synced kotlin VERSION_NAME → ${version}`);
