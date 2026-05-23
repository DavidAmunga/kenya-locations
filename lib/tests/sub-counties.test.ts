import { expect, it, describe } from "vitest";
import {
  getSubCounties,
  getSubCountyByCode,
  getSubCountyByName,
  getSubCountiesInCounty,
  getCountyOfSubCounty,
} from "../sub-counties";

describe("Sub-Counties Module", () => {
  describe("getSubCounties", () => {
    it("returns all 307 sub-counties", () => {
      expect(getSubCounties()).toHaveLength(307);
    });
  });

  describe("getSubCountyByCode", () => {
    it("returns sub-county by code", () => {
      const first = getSubCounties()[0];
      expect(getSubCountyByCode(first.code)?.code).toBe(first.code);
    });

    it("returns undefined for unknown code", () => {
      expect(getSubCountyByCode("99999")).toBeUndefined();
    });
  });

  describe("getSubCountyByName", () => {
    it("returns sub-county by name (case-insensitive)", () => {
      const first = getSubCounties()[0];
      expect(getSubCountyByName(first.name.toLowerCase())?.name).toBe(
        first.name
      );
    });

    it("returns undefined for unknown name", () => {
      expect(getSubCountyByName("Nowhere")).toBeUndefined();
    });
  });

  describe("getSubCountiesInCounty", () => {
    it("returns 17 sub-counties for Nairobi by name", () => {
      const result = getSubCountiesInCounty("Nairobi");
      expect(result).toHaveLength(17);
      result.forEach((sc) => expect(sc.county).toBe("Nairobi"));
    });

    it("resolves by county code", () => {
      expect(getSubCountiesInCounty("047").length).toBeGreaterThan(0);
    });

    it("returns empty array for unknown county", () => {
      expect(getSubCountiesInCounty("Nowhere")).toEqual([]);
    });
  });

  describe("getCountyOfSubCounty", () => {
    it("returns the county of a sub-county", () => {
      const first = getSubCounties()[0];
      const county = getCountyOfSubCounty(first.name);
      expect(county?.name).toBe(first.county);
    });

    it("returns undefined for unknown sub-county", () => {
      expect(getCountyOfSubCounty("Nowhere")).toBeUndefined();
    });
  });
});
