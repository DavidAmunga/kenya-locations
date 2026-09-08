#!/usr/bin/env bash
# Copy shared JSON from data/ into this example's Flutter assets.
set -euo pipefail
root="$(cd "$(dirname "$0")/../../.." && pwd)"
dest="$(cd "$(dirname "$0")/../assets/data" && pwd)"
mkdir -p "$dest"
cp "$root/data/"*.json "$dest"
echo "Copied data/*.json → examples/flutter/assets/data/"
