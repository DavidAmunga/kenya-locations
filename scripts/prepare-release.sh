#!/bin/bash

# Kenya Locations - Prepare Release Script
# This script helps prepare a release by running all checks and providing guidance

set -e

echo "🚀 Kenya Locations - Release Preparation"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version:${NC} $CURRENT_VERSION"
echo ""

# Function to run checks
run_check() {
    local name=$1
    local command=$2
    
    echo -e "${YELLOW}Running $name...${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✓ $name passed${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ $name failed${NC}"
        echo ""
        return 1
    fi
}

# Run all checks
FAILED=0

run_check "Linting" "pnpm lint" || FAILED=1
run_check "Format check" "pnpm format:check" || FAILED=1
run_check "Data validation" "pnpm validate" || FAILED=1
run_check "Tests" "pnpm test" || FAILED=1
run_check "Build" "pnpm build" || FAILED=1

echo "========================================"
echo ""

if [ $FAILED -eq 1 ]; then
    echo -e "${RED}❌ Some checks failed. Please fix the issues before releasing.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "========================================"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Update version in package.json:"
echo -e "   ${YELLOW}npm version patch${NC}  # for bug fixes (e.g., 0.1.8 → 0.1.9)"
echo -e "   ${YELLOW}npm version minor${NC}  # for new features (e.g., 0.1.8 → 0.2.0)"
echo -e "   ${YELLOW}npm version major${NC}  # for breaking changes (e.g., 0.1.8 → 1.0.0)"
echo ""
echo "2. Update CHANGELOG.md with release notes"
echo ""
echo "3. Commit and push changes:"
echo -e "   ${YELLOW}git add package.json CHANGELOG.md${NC}"
echo -e "   ${YELLOW}git commit -m \"chore: bump version to X.X.X\"${NC}"
echo -e "   ${YELLOW}git push origin main${NC}"
echo ""
echo "4. Create a GitHub release:"
echo "   - Go to: https://github.com/[username]/kenya-locations/releases/new"
echo "   - Tag: vX.X.X (e.g., v0.1.9)"
echo "   - Add release notes"
echo "   - Click 'Publish release'"
echo ""
echo "5. The GitHub Action will automatically publish to npm"
echo ""
echo -e "${GREEN}Happy releasing! 🎉${NC}"

