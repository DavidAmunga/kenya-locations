import {
  getCounties,
  county,
  getConstituencies,
  getConstituencyByCode,
  getWards,
  getWardsInCounty,
  getCountyOfWard,
  search,
  getSubCounties,
  getSubCountiesInCounty,
  getCountyOfSubCounty,
  getLocalities,
  getAreas,
  getLocalityByName,
  getAreaByName,
  getLocalitiesInCounty,
  getAreasInLocality,
  getAreasInCounty,
  getCountyOfLocality,
  getCountyOfArea,
  getLocalityOfArea,
  locality,
} from "../KenyaLocations";
import { expect, it, describe } from "vitest";

describe("KenyaLocations - Main API", () => {
  describe("getCounties", () => {
    it("should return all counties", () => {
      expect(getCounties()).toHaveLength(47);
    });
  });

  describe("county", () => {
    it("should return a county by name", () => {
      expect(county("Mombasa")?.name).toBe("Mombasa");
    });

    it("should return a county by code", () => {
      expect(county("001")?.code).toBe("001");
    });

    it("should return undefined for non-existent county", () => {
      expect(county("NonExistent")).toBeUndefined();
    });

    it("should provide access to constituencies, localities and areas", () => {
      const nairobi = county("Nairobi")!;

      expect(nairobi.constituencies().length).toBeGreaterThan(0);
      expect(nairobi.localities().length).toBeGreaterThan(0);
      expect(nairobi.areas().length).toBeGreaterThan(0);

      const westlands = nairobi.locality("Westlands");
      expect(westlands.name).toBe("Westlands");

      const westlandsAreas = nairobi.areasByLocality("Westlands");
      expect(westlandsAreas.length).toBeGreaterThan(0);
    });

    it("should throw error for non-existent locality", () => {
      const nairobi = county("Nairobi")!;
      expect(() => nairobi.locality("NonExistentLocality")).toThrow();
    });
  });

  describe("getConstituencies", () => {
    it("should return all constituencies", () => {
      expect(getConstituencies()).toHaveLength(290);
    });
  });

  describe("getConstituencyByCode", () => {
    it("should return a constituency by code", () => {
      expect(getConstituencyByCode("001")?.code).toBe("001");
    });

    it("should return undefined for non-existent constituency", () => {
      expect(getConstituencyByCode("NonExistent")).toBeUndefined();
    });
  });

  describe("getWards", () => {
    it("should return all wards with constituency field", () => {
      const wards = getWards();
      expect(wards).toHaveLength(1448);
      expect(typeof wards[0].constituency).toBe("string");
    });
  });

  describe("getWardsInCounty", () => {
    it("should return wards in a county by code", () => {
      expect(getWardsInCounty("001").length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent county", () => {
      expect(getWardsInCounty("NonExistent")).toEqual([]);
    });
  });

  describe("getCountyOfWard", () => {
    it("should return undefined for non-existent ward", () => {
      expect(getCountyOfWard("NonExistentWard")).toBeUndefined();
    });
  });

  describe("getSubCounties", () => {
    it("should return all sub-counties", () => {
      expect(getSubCounties()).toHaveLength(307);
    });
  });

  describe("getSubCountiesInCounty", () => {
    it("should return sub-counties in a county", () => {
      const result = getSubCountiesInCounty("047");
      expect(result.length).toBeGreaterThan(0);
      result.forEach((sc) => expect(sc.county).toBe("Nairobi"));
    });

    it("should return empty array for non-existent county", () => {
      expect(getSubCountiesInCounty("NonExistent")).toEqual([]);
    });
  });

  describe("getCountyOfSubCounty", () => {
    it("should return the county of a sub-county", () => {
      const first = getSubCounties()[0];
      expect(getCountyOfSubCounty(first.name)?.name).toBe(first.county);
    });

    it("should return undefined for non-existent sub-county", () => {
      expect(getCountyOfSubCounty("NonExistent")).toBeUndefined();
    });
  });

  describe("getLocalities", () => {
    it("should return all localities", () => {
      const result = getLocalities();
      expect(result).toHaveLength(916);
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("county");
    });
  });

  describe("getAreas", () => {
    it("should return all areas", () => {
      const result = getAreas();
      expect(result).toHaveLength(1829);
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("locality");
      expect(result[0]).toHaveProperty("county");
    });
  });

  describe("getLocalityByName", () => {
    it("should return a locality by name", () => {
      const westlands = getLocalityByName("Westlands");
      expect(westlands?.name).toBe("Westlands");
      expect(westlands?.county).toBe("Nairobi");
    });

    it("should return undefined for non-existent locality", () => {
      expect(getLocalityByName("NonExistentLocality")).toBeUndefined();
    });

    it("should provide access to areas and county", () => {
      const westlands = getLocalityByName("Westlands")!;
      expect(westlands.areas().length).toBeGreaterThan(0);
      expect(westlands.getCounty()?.name).toBe("Nairobi");
      expect(westlands.area("Gigiri").name).toBe("Gigiri");
    });

    it("should throw error for non-existent area", () => {
      const westlands = getLocalityByName("Westlands")!;
      expect(() => westlands.area("NonExistentArea")).toThrow();
    });
  });

  describe("getAreaByName", () => {
    it("should return an area by name", () => {
      const gigiri = getAreaByName("Gigiri");
      expect(gigiri?.name).toBe("Gigiri");
      expect(gigiri?.locality).toBe("Westlands");
      expect(gigiri?.county).toBe("Nairobi");
    });

    it("should return undefined for non-existent area", () => {
      expect(getAreaByName("NonExistentArea")).toBeUndefined();
    });
  });

  describe("getLocalitiesInCounty", () => {
    it("should return all localities in a county", () => {
      const result = getLocalitiesInCounty("Nairobi");
      expect(result.length).toBeGreaterThan(0);
      result.forEach((l) => expect(l.county).toBe("Nairobi"));
    });

    it("should return empty array for non-existent county", () => {
      expect(getLocalitiesInCounty("NonExistentCounty")).toEqual([]);
    });
  });

  describe("getAreasInLocality", () => {
    it("should return all areas in a locality", () => {
      const result = getAreasInLocality("Westlands");
      expect(result.length).toBeGreaterThan(0);
      result.forEach((a) => expect(a.locality).toBe("Westlands"));
    });

    it("should return empty array for non-existent locality", () => {
      expect(getAreasInLocality("NonExistentLocality")).toEqual([]);
    });
  });

  describe("getAreasInCounty", () => {
    it("should return all areas in a county", () => {
      const result = getAreasInCounty("Nairobi");
      expect(result.length).toBeGreaterThan(0);
      result.forEach((a) => expect(a.county).toBe("Nairobi"));
    });

    it("should return empty array for non-existent county", () => {
      expect(getAreasInCounty("NonExistentCounty")).toEqual([]);
    });
  });

  describe("getCountyOfLocality", () => {
    it("should return the county of a locality", () => {
      expect(getCountyOfLocality("Westlands")?.name).toBe("Nairobi");
    });

    it("should return undefined for non-existent locality", () => {
      expect(getCountyOfLocality("NonExistentLocality")).toBeUndefined();
    });
  });

  describe("getCountyOfArea", () => {
    it("should return the county of an area", () => {
      expect(getCountyOfArea("Gigiri")?.name).toBe("Nairobi");
    });

    it("should return undefined for non-existent area", () => {
      expect(getCountyOfArea("NonExistentArea")).toBeUndefined();
    });
  });

  describe("getLocalityOfArea", () => {
    it("should return the locality of an area", () => {
      const loc = getLocalityOfArea("Gigiri");
      expect(loc?.name).toBe("Westlands");
      expect(loc?.county).toBe("Nairobi");
    });

    it("should return undefined for non-existent area", () => {
      expect(getLocalityOfArea("NonExistentArea")).toBeUndefined();
    });
  });

  describe("locality", () => {
    it("should return a locality by name", () => {
      expect(locality("Westlands")?.name).toBe("Westlands");
    });

    it("should return a locality by name within a specific county", () => {
      const w = locality("Westlands", "Nairobi");
      expect(w?.name).toBe("Westlands");
      expect(w?.county).toBe("Nairobi");
    });

    it("should return undefined for non-existent locality", () => {
      expect(locality("NonExistentLocality")).toBeUndefined();
    });

    it("should return undefined for locality not in specified county", () => {
      expect(locality("Westlands", "Mombasa")).toBeUndefined();
    });
  });

  describe("search", () => {
    it("should return search results", () => {
      expect(search("Nairob").length).toBeGreaterThan(0);
    });

    it("should return an empty array for non-existent query", () => {
      expect(search("NonExistent")).toEqual([]);
    });

    it("should respect the limit parameter", () => {
      expect(search("Nairob", { limit: 1 }).length).toBeLessThanOrEqual(1);
    });

    it("should include localities and areas in search results", () => {
      expect(search("Westlands").some((r) => r.type === "locality")).toBe(true);
      expect(search("Gigiri").some((r) => r.type === "area")).toBe(true);
    });

    it("should support type filtering", () => {
      expect(
        search("Nairobi", { types: ["county"] }).every(
          (r) => r.type === "county"
        )
      ).toBe(true);
    });
  });
});
