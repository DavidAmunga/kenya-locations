import { expect, it, describe } from "vitest";
import { search, searchByType } from "../search";

const TYPE_ORDER: Record<string, number> = {
  county: 1,
  constituency: 2,
  ward: 3,
  "sub-county": 4,
  locality: 5,
  area: 6,
};

describe("Search Module", () => {
  describe("search", () => {
    it("returns results for a valid query", () => {
      expect(search("Nairob").length).toBeGreaterThan(0);
    });

    it("returns empty array for a too-short query", () => {
      expect(search("N")).toEqual([]);
    });

    it("returns empty array for unrecognised query", () => {
      expect(search("NonExistentXYZ")).toEqual([]);
    });

    it("respects the limit option", () => {
      const results = search("Nairob", { limit: 1 });
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it("finds localities and areas", () => {
      const results = search("Westlands");
      const types = results.map((r) => r.type);
      expect(types).toContain("locality");

      const areaResults = search("Gigiri");
      expect(areaResults.some((r) => r.type === "area")).toBe(true);
    });

    it("returns results in type-hierarchy order", () => {
      const results = search("Nairobi", { limit: 10 });
      let lastOrder = 0;
      results.forEach((r) => {
        const order = TYPE_ORDER[r.type];
        expect(order).toBeGreaterThanOrEqual(lastOrder);
        lastOrder = order;
      });
    });

    it("filters by types option", () => {
      const countyOnly = search("Nairobi", { types: ["county"] });
      expect(countyOnly.every((r) => r.type === "county")).toBe(true);

      const localityAndArea = search("West", {
        types: ["locality", "area"],
      });
      expect(
        localityAndArea.every((r) => r.type === "locality" || r.type === "area")
      ).toBe(true);
    });
  });

  describe("searchByType", () => {
    it("returns only the requested type", () => {
      const results = searchByType("Nairobi", "county", 5);
      expect(results.every((r) => r.type === "county")).toBe(true);
    });

    it("respects limit", () => {
      const results = searchByType("West", "locality", 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });
});
