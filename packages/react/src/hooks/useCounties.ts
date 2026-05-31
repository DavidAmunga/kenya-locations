import { useMemo } from "react";
import {
  getCounties,
  county as getCountyWrapper,
  type County,
  type CountyWrapper,
} from "kenya-locations";

/**
 * Returns the full list of all 47 Kenyan counties.
 * The array reference is stable across renders (memoized once).
 *
 * @example
 * ```tsx
 * const counties = useCounties();
 * return <select>{counties.map(c => <option key={c.code}>{c.name}</option>)}</select>;
 * ```
 */
export function useCounties(): County[] {
  return useMemo(() => getCounties(), []);
}

/**
 * Returns a `CountyWrapper` for the given county name or code, or `undefined`
 * if not found. Re-memoizes only when `nameOrCode` changes.
 *
 * @example
 * ```tsx
 * const nairobi = useCounty('Nairobi');
 * const constituencies = nairobi?.constituencies() ?? [];
 * ```
 */
export function useCounty(
  nameOrCode: string | undefined
): CountyWrapper | undefined {
  return useMemo(
    () => (nameOrCode ? getCountyWrapper(nameOrCode) : undefined),
    [nameOrCode]
  );
}
