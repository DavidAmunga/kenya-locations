# 🪝 Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) and
[lint-staged](https://github.com/okonet/lint-staged) to ensure code quality and data integrity
before commits are made.

## 🎯 What Do the Hooks Do?

### Pre-commit Hook

The pre-commit hook runs automatically before each commit and performs the following checks:

1. **Code Formatting & Linting**

   - Runs ESLint to check for code quality issues
   - Automatically fixes fixable ESLint issues
   - Formats code with Prettier for consistent styling
   - Only processes staged files for better performance

2. **Data Validation** (when data files are changed)

   - Validates data integrity across all data files
   - Checks for duplicate codes/names within appropriate contexts
   - Verifies all references between files are valid
   - Ensures proper data structure and formatting
   - Only runs when data files (`lib/data/*.ts`) are staged

3. **Test Execution**
   - Runs the full test suite to ensure nothing is broken
   - Prevents commits that would break existing functionality

### Commit Message Hook

The commit-msg hook enforces conventional commit message format:

```
<type>(<scope>): <description>

Examples:
✅ feat(search): add type-specific filtering
✅ data(nairobi): add new localities and areas
✅ fix(validation): handle duplicate names correctly
✅ docs: update contribution guidelines
❌ added some stuff
❌ fix bug
```

**Supported types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `data`: Adding or updating location data

## 🚀 Benefits

### For Contributors

1. **Automatic Code Quality**: No need to manually run linting or formatting
2. **Early Error Detection**: Catch issues before they reach the repository
3. **Consistent Style**: All code follows the same formatting standards
4. **Data Integrity**: Prevents invalid data from being committed
5. **Better Commit History**: Conventional commits make the history more readable

### For Maintainers

1. **Reduced Review Time**: PRs arrive pre-validated and formatted
2. **Consistent Data Quality**: All data changes are automatically validated
3. **Better Changelog Generation**: Conventional commits enable automatic changelog generation
4. **Fewer CI Failures**: Issues are caught locally before pushing

## 🛠️ Setup

The hooks are automatically installed when you run:

```bash
npm install
# or
pnpm install
```

This happens because of the `"prepare": "husky"` script in `package.json`.

## 🔧 Configuration

### Lint-staged Configuration

Located in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "lib/data/*.ts": ["node scripts/validate-staged.js"]
  }
}
```

### Prettier Configuration

Located in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 🚨 What Happens When Hooks Fail?

### Pre-commit Failures

If the pre-commit hook fails, your commit will be rejected. Common scenarios:

1. **Linting Errors**: Fix the reported ESLint issues
2. **Data Validation Errors**: Fix the data integrity issues reported
3. **Test Failures**: Fix the failing tests
4. **Formatting Issues**: Usually auto-fixed, but may need manual intervention

### Commit Message Failures

If your commit message doesn't follow the conventional format:

```bash
❌ Invalid commit message format!

Commit message should follow the format:
  <type>(<scope>): <description>

Examples:
  feat(search): add type-specific filtering
  data(nairobi): add new localities and areas
  fix(validation): handle duplicate names correctly
  docs: update contribution guidelines
```

## 🔄 Manual Commands

You can run the same checks manually:

```bash
# Run linting and formatting on all files
npm run lint:fix
npm run format

# Run data validation
npm run validate

# Run tests
npm test

# Run lint-staged on currently staged files
npx lint-staged
```

## 🛑 Bypassing Hooks (Not Recommended)

In rare cases, you might need to bypass the hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip commit-msg hook
git commit --no-verify -m "any message format"
```

**⚠️ Warning**: Only use `--no-verify` in emergency situations. It bypasses all quality checks and
can introduce issues.

## 🐛 Troubleshooting

### Hook Not Running

1. Ensure Husky is installed: `npm run prepare`
2. Check if `.husky/` directory exists
3. Verify hooks are executable: `chmod +x .husky/*`

### Performance Issues

1. The data validation only runs when data files are changed
2. Lint-staged only processes staged files, not the entire codebase
3. If still slow, consider running `pnpm run build` separately

### False Positives

1. **Data Validation**: Check the validation script output for specific issues
2. **ESLint**: Review the ESLint configuration in the project
3. **Tests**: Ensure your changes don't break existing functionality

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

---

These hooks help maintain the high quality standards of the Kenya Locations library. Thank you for
contributing! 🇰🇪
