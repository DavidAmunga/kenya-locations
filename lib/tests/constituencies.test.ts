import { expect, it, describe } from "vitest";
import {
  getConstituencies,
  getConstituencyByCode,
  getConstituencyByName,
  getWardsInConstituency,
  getCountyOfConstituency,
  ConstituencyWrapper,
} from "../constituencies";
import { LocationError } from "../errors/LocationErrors";

describe("Constituencies Module", () => {
  describe("getConstituencies", () => {
    it("returns all 290 constituencies", () => {
      expect(getConstituencies()).toHaveLength(290);
    });
  });

  describe("getConstituencyByCode", () => {
    it("returns constituency by code", () => {
      const changamwe = getConstituencyByCode("001");
      expect(changamwe?.code).toBe("001");
    });

    it("returns undefined for unknown code", () => {
      expect(getConstituencyByCode("999")).toBeUndefined();
    });
  });

  describe("getConstituencyByName", () => {
    it("returns constituency by name (case-insensitive)", () => {
      expect(getConstituencyByName("westlands")?.name).toBe("Westlands");
    });

    it("returns undefined for unknown name", () => {
      expect(getConstituencyByName("Nowhere")).toBeUndefined();
    });
  });

  describe("getWardsInConstituency", () => {
    it("returns wards by constituency name", () => {
      const wards = getWardsInConstituency("Westlands");
      expect(wards.length).toBeGreaterThan(0);
    });

    it("returns wards by constituency code", () => {
      const wards = getWardsInConstituency("001");
      expect(wards.length).toBeGreaterThan(0);
    });

    it("returns empty array for unknown constituency", () => {
      expect(getWardsInConstituency("Nowhere")).toEqual([]);
    });
  });

  describe("getCountyOfConstituency", () => {
    it("resolves by name", () => {
      expect(getCountyOfConstituency("Westlands")?.name).toBe("Nairobi");
    });

    it("resolves by code", () => {
      const county = getCountyOfConstituency("001");
      expect(county).toBeDefined();
    });

    it("returns undefined for unknown constituency", () => {
      expect(getCountyOfConstituency("Nowhere")).toBeUndefined();
    });
  });

  describe("ConstituencyWrapper", () => {
    it("exposes wards", () => {
      const changamwe = getConstituencyByCode("001")!;
      expect(changamwe).toBeInstanceOf(ConstituencyWrapper);
      expect(changamwe.wards().length).toBeGreaterThan(0);
    });

    it("resolves parent county", () => {
      const changamwe = getConstituencyByCode("001")!;
      expect(changamwe.getCounty()?.name).toBe("Mombasa");
    });

    it("returns a ward by code", () => {
      const westlands = getConstituencyByName("Westlands")!;
      const ward = westlands.wards()[0];
      const found = westlands.ward(ward.code);
      expect(found.code).toBe(ward.code);
    });

    it("throws LocationError for unknown ward", () => {
      const westlands = getConstituencyByName("Westlands")!;
      expect(() => westlands.ward("NoWard")).toThrow(LocationError);
    });

    it("exposes data getter as a plain object copy", () => {
      const changamwe = getConstituencyByCode("001")!;
      expect(changamwe.data).toMatchObject({ code: "001" });
    });
  });
});
