import { expect, it, describe } from "vitest";
import {
  getCounties,
  getCountyByCode,
  getCountyByName,
  county,
  CountyWrapper,
} from "../counties";
import { ConstituencyWrapper } from "../constituencies";
import { LocalityWrapper } from "../localities";
import { LocationNotFoundError } from "../errors/LocationErrors";

describe("Counties Module", () => {
  describe("getCounties", () => {
    it("returns all 47 counties", () => {
      const result = getCounties();
      expect(result).toHaveLength(47);
    });
  });

  describe("getCountyByCode", () => {
    it("returns county by code", () => {
      const mombasa = getCountyByCode("001");
      expect(mombasa?.name).toBe("Mombasa");
    });

    it("returns undefined for unknown code", () => {
      expect(getCountyByCode("999")).toBeUndefined();
    });
  });

  describe("getCountyByName", () => {
    it("returns county by name (case-insensitive)", () => {
      expect(getCountyByName("nairobi")?.name).toBe("Nairobi");
      expect(getCountyByName("Nairobi")?.name).toBe("Nairobi");
    });

    it("returns undefined for unknown name", () => {
      expect(getCountyByName("Nowhere")).toBeUndefined();
    });
  });

  describe("county", () => {
    it("resolves by name", () => {
      const nairobi = county("Nairobi");
      expect(nairobi?.name).toBe("Nairobi");
      expect(nairobi?.code).toBe("047");
    });

    it("resolves by code", () => {
      const mombasa = county("001");
      expect(mombasa?.code).toBe("001");
    });

    it("returns undefined for unknown input", () => {
      expect(county("NonExistent")).toBeUndefined();
    });
  });

  describe("CountyWrapper", () => {
    it("exposes constituencies, localities, areas and wards", () => {
      const nairobi = county("Nairobi")!;
      expect(nairobi).toBeInstanceOf(CountyWrapper);

      expect(nairobi.constituencies().length).toBeGreaterThan(0);
      expect(nairobi.localities().length).toBeGreaterThan(0);
      expect(nairobi.areas().length).toBeGreaterThan(0);
      expect(nairobi.wards().length).toBeGreaterThan(0);
    });

    it("filters areas by locality", () => {
      const nairobi = county("Nairobi")!;
      const westlandsAreas = nairobi.areasByLocality("Westlands");
      expect(westlandsAreas.length).toBeGreaterThan(0);
      westlandsAreas.forEach((a) => expect(a.locality).toBe("Westlands"));
    });

    it("exposes data getter as a plain object copy with enriched fields", () => {
      const nairobi = county("Nairobi")!;
      expect(nairobi.data.code).toBe("047");
      expect(nairobi.data.name).toBe("Nairobi");
      expect(nairobi.data.capital).toBe("Nairobi");
      expect(nairobi.data.region).toBe("Nairobi");
      expect(nairobi.data.population_2019).toBeGreaterThan(0);
      expect(nairobi.data.area_km2).toBeGreaterThan(0);
      expect(nairobi.data.postal_code).toBe("00100");
    });

    it("returns a constituency by name", () => {
      const nairobi = county("Nairobi")!;
      const westlands = nairobi.constituency("Westlands");
      expect(westlands.name).toBe("Westlands");
      expect(westlands.county).toBe("Nairobi");
    });

    it("returns a constituency by code", () => {
      const nairobi = county("Nairobi")!;
      const westlands = nairobi.constituency("274");
      expect(westlands.name).toBe("Westlands");
    });

    it("throws LocationNotFoundError for unknown constituency", () => {
      const nairobi = county("Nairobi")!;
      expect(() => nairobi.constituency("Nowhere")).toThrow(
        LocationNotFoundError
      );
    });

    it("returns a locality by name", () => {
      const nairobi = county("Nairobi")!;
      const westlands = nairobi.locality("Westlands");
      expect(westlands.name).toBe("Westlands");
      expect(westlands.county).toBe("Nairobi");
    });

    it("throws LocationNotFoundError for unknown locality", () => {
      const nairobi = county("Nairobi")!;
      expect(() => nairobi.locality("Nowhere")).toThrow(LocationNotFoundError);
    });

    it("constituencies() returns ConstituencyWrapper instances", () => {
      const nairobi = county("Nairobi")!;
      const cs = nairobi.constituencies();
      expect(cs[0]).toBeInstanceOf(ConstituencyWrapper);
      expect(cs[0].wards().length).toBeGreaterThan(0);
    });

    it("constituency() returns a ConstituencyWrapper", () => {
      const nairobi = county("Nairobi")!;
      const w = nairobi.constituency("Westlands");
      expect(w).toBeInstanceOf(ConstituencyWrapper);
      expect(w.wards().length).toBeGreaterThan(0);
    });

    it("localities() returns LocalityWrapper instances", () => {
      const nairobi = county("Nairobi")!;
      const ls = nairobi.localities();
      expect(ls[0]).toBeInstanceOf(LocalityWrapper);
      // Use Westlands which is known to have areas
      const westlands = ls.find((l) => l.name === "Westlands")!;
      expect(westlands.areas().length).toBeGreaterThan(0);
    });

    it("locality() returns a LocalityWrapper", () => {
      const nairobi = county("Nairobi")!;
      const w = nairobi.locality("Westlands");
      expect(w).toBeInstanceOf(LocalityWrapper);
      expect(w.areas().length).toBeGreaterThan(0);
    });
  });
});
