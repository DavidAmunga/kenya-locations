import { expect, it, describe } from "vitest";
import {
  getCounties,
  getCountyByCode,
  getCountyByName,
  county,
  CountyWrapper,
} from "../counties";

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

    it("exposes data getter as a plain object copy", () => {
      const nairobi = county("Nairobi")!;
      expect(nairobi.data).toEqual({ code: "047", name: "Nairobi" });
    });
  });
});
