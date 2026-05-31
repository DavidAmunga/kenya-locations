import { useMemo } from "react";
import {
  getAreas,
  getAreasInLocality,
  getAreasInCounty,
  type Area,
} from "kenya-locations";

/**
 * Returns all 1,829 areas. Stable reference.
 */
export function useAreas(): Area[] {
  return useMemo(() => getAreas(), []);
}

/**
 * Returns all areas in a locality (by exact locality name).
 *
 * @example
 * ```tsx
 * const areas = useAreasInLocality('Westlands');
 * ```
 */
export function useAreasInLocality(localityName: string | undefined): Area[] {
  return useMemo(
    () => (localityName ? getAreasInLocality(localityName) : []),
    [localityName]
  );
}

/**
 * Returns all areas in a county (by exact county name).
 *
 * @example
 * ```tsx
 * const areas = useAreasInCounty('Nairobi');
 * ```
 */
export function useAreasInCounty(countyName: string | undefined): Area[] {
  return useMemo(
    () => (countyName ? getAreasInCounty(countyName) : []),
    [countyName]
  );
}
