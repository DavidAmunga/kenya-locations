/**
 * Shared map-building utilities
 */

/**
 * Build a Map from an array using a key function.
 * When duplicate keys occur, the last item wins.
 */
export function buildLookupMap<T>(
  items: readonly T[],
  keyFn: (item: T) => string
): Map<string, T> {
  return new Map(items.map((item) => [keyFn(item), item]));
}

/**
 * Build a Map grouping items by a key function.
 * Items where keyFn returns undefined are skipped.
 */
export function buildGroupMap<T>(
  items: readonly T[],
  keyFn: (item: T) => string | undefined
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    if (key === undefined) continue;
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}
