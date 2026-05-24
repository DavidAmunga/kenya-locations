# Data Addition Template

Use this template as a reference when adding new data to the Kenya Locations library.

## Counties Template

```typescript
// lib/data/counties.ts
{ code: "XXX", name: "County Name" }
```

**Example:**

```typescript
{ code: "047", name: "Nairobi" }
```

## Sub-Counties Template

```typescript
// lib/data/sub-counties.ts
{ code: "XXXXX", name: "Sub-County Name", county: "County Name" }
```

**Example:**

```typescript
{ code: "04701", name: "Westlands", county: "Nairobi" }
```

## Constituencies Template

```typescript
// lib/data/constituencies.ts
{ code: "XXX", name: "Constituency Name", county: counties[INDEX] }
```

**Example:**

```typescript
{ code: "290", name: "Westlands", county: counties[29] } // counties[29] = Nairobi
```

**Finding County Index:**

1. Counties are in alphabetical order
2. Count from 0 (zero-based indexing)
3. Nairobi is at index 29

## Wards Template

```typescript
// lib/data/wards.ts
{ code: "XXXX", name: "Ward Name", constituency: "Constituency Name" }
```

**Example:**

```typescript
{ code: "1437", name: "Mountain View", constituency: "Westlands" }
```

## Localities Template

```typescript
// lib/data/locality.ts
{ name: "Locality Name", county: "County Name" }
```

**Example:**

```typescript
{ name: "Westlands", county: "Nairobi" }
```

## Areas Template

```typescript
// lib/data/area.ts
{ name: "Area Name", locality: "Locality Name", county: "County Name" }
```

**Example:**

```typescript
{ name: "Gigiri", locality: "Westlands", county: "Nairobi" }
```

## Validation Checklist

Before submitting your changes:

- [ ] All names match exactly between files
- [ ] All codes are unique within their category
- [ ] Used official government names
- [ ] Followed proper formatting (double quotes, 2-space indentation)
- [ ] Ran `pnpm run build` successfully
- [ ] Ran `pnpm test` successfully
- [ ] Ran `pnpm run validate` successfully
- [ ] Tested search functionality with new data

## Common Mistakes to Avoid

1. **Name Mismatches**: Ensure exact spelling between files

   ```typescript
   // ❌ Wrong
   { name: "Gigiri", locality: "Westland", county: "Nairobi" }

   // ✅ Correct
   { name: "Gigiri", locality: "Westlands", county: "Nairobi" }
   ```

2. **Wrong County Index**: Double-check the county array index

   ```typescript
   // ❌ Wrong
   { code: "290", name: "Westlands", county: counties[30] }

   // ✅ Correct
   { code: "290", name: "Westlands", county: counties[29] }
   ```

3. **Duplicate Codes**: Ensure all codes are unique

   ```typescript
   // ❌ Wrong - duplicate code
   { code: "1437", name: "Mountain View", constituency: "Westlands" },
   { code: "1437", name: "Another Ward", constituency: "Dagoretti" }

   // ✅ Correct - unique codes
   { code: "1437", name: "Mountain View", constituency: "Westlands" },
   { code: "1438", name: "Another Ward", constituency: "Dagoretti" }
   ```

4. **Formatting Issues**: Follow consistent formatting

   ```typescript
   // ❌ Wrong - inconsistent quotes and spacing
   { code: '047', name: "Nairobi"},

   // ✅ Correct - consistent formatting
   { code: "047", name: "Nairobi" }
   ```

## Data Sources

- **Counties**: [Kenya National Bureau of Statistics](https://www.knbs.or.ke/)
- **Constituencies & Wards**: [IEBC](https://www.iebc.or.ke/)
- **Sub-Counties**: Kenya Gazette notices
- **Localities & Areas**: Local government records, postal data
