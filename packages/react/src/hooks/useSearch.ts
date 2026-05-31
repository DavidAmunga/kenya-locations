import { useState, useEffect, useMemo } from "react";
import { search, type SearchResult, type SearchType } from "kenya-locations";

export interface UseSearchOptions {
  /** Maximum number of results. Defaults to 10. */
  limit?: number;
  /** Restrict search to specific entity types. Searches all types when omitted. */
  types?: SearchType[];
  /**
   * Debounce delay in milliseconds before the search fires after the query
   * changes. Defaults to 300ms. Set to 0 to disable debouncing.
   */
  debounceMs?: number;
}

export interface UseSearchReturn {
  results: SearchResult[];
  /** True while the debounce timer is pending (query changed but search hasn't fired yet). */
  isPending: boolean;
}

/**
 * Fuzzy-search across all Kenyan administrative divisions with built-in
 * debouncing.
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const [query, setQuery] = useState('');
 *   const { results, isPending } = useSearch(query, { types: ['county', 'constituency'] });
 *
 *   return (
 *     <>
 *       <input value={query} onChange={e => setQuery(e.target.value)} />
 *       {isPending && <span>…</span>}
 *       {results.map((r, i) => (
 *         <div key={i}>
 *           {r.type === 'county' && r.item.code + ' — '}
 *           {r.item.name}
 *         </div>
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export function useSearch(
  query: string,
  options: UseSearchOptions = {}
): UseSearchReturn {
  const { limit = 10, types, debounceMs = 300 } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (debounceMs === 0) {
      setDebouncedQuery(query);
      setIsPending(false);
      return;
    }

    setIsPending(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsPending(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(
    () => search(debouncedQuery, { limit, types }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery, limit, JSON.stringify(types)]
  );

  return { results, isPending };
}
