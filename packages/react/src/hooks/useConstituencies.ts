import { useMemo } from "react";
import {
  getConstituencies,
  getConstituencyByCode,
  getConstituencyByName,
  getConstituenciesInCounty,
  type Constituency,
  type ConstituencyWrapper,
} from "kenya-locations";

/**
 * Returns all 290 constituencies. Stable reference.
 *
 * @example
 * ```tsx
 * const constituencies = useConstituencies();
 * ```
 */
export function useConstituencies(): Constituency[] {
  return useMemo(() => getConstituencies(), []);
}

/**
 * Returns a `ConstituencyWrapper` for the given code or name, or `undefined`.
 *
 * @example
 * ```tsx
 * const westlands = useConstituency('Westlands');
 * const wards = westlands?.wards() ?? [];
 * ```
 */
export function useConstituency(
  codeOrName: string | undefined
): ConstituencyWrapper | undefined {
  return useMemo(() => {
    if (!codeOrName) return undefined;
    return getConstituencyByCode(codeOrName) ?? getConstituencyByName(codeOrName);
  }, [codeOrName]);
}

/**
 * Returns all constituencies in a county (by name or code) as `ConstituencyWrapper[]`.
 * Returns an empty array when `countyNameOrCode` is undefined or not found.
 *
 * @example
 * ```tsx
 * const cs = useConstituenciesInCounty('Nairobi');
 * ```
 */
export function useConstituenciesInCounty(
  countyNameOrCode: string | undefined
): ConstituencyWrapper[] {
  return useMemo(
    () => (countyNameOrCode ? getConstituenciesInCounty(countyNameOrCode) : []),
    [countyNameOrCode]
  );
}
