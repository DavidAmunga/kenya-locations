---
name: Data Contribution
about: Add or update location data (counties, localities, areas, etc.)
title: "[DATA] "
labels: data, contribution
assignees: ""
---

## Data Type

What type of data are you contributing?

- [ ] New County Data
- [ ] New Localities
- [ ] New Areas
- [ ] New Sub-Counties
- [ ] New Constituencies
- [ ] New Wards
- [ ] Data Correction/Update

## Location Details

**County**: [e.g., Nairobi]  
**Locality** (if applicable): [e.g., Westlands]  
**Area** (if applicable): [e.g., Parklands]

## Data to Add/Update

Provide the data in the format below:

```typescript
// For localities
{
  name: "Locality Name",
  county: "County Name"
}

// For areas
{
  name: "Area Name",
  locality: "Locality Name"
}
```

## Data Source

Please provide the source of this data:

- [ ] IEBC (Independent Electoral and Boundaries Commission)
- [ ] KNBS (Kenya National Bureau of Statistics)
- [ ] County Government Records
- [ ] Personal Knowledge (verified)
- [ ] Other: [Please specify]

**Source Link** (if available):

## Verification

- [ ] I have verified this data is accurate
- [ ] I have checked for duplicates in existing data
- [ ] I have followed the data format in [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [ ] I have checked the spelling and formatting

## Additional Context

Any additional information about this data contribution.

---
