import pkg from "../package.json";

/**
 * The current version of the kenya-locations package and dataset.
 * Derived directly from package.json so it is always in sync with the
 * published version — no manual maintenance required.
 *
 * @example
 * ```ts
 * import { DATA_VERSION } from 'kenya-locations';
 * console.log(DATA_VERSION); // e.g. "0.4.0"
 * ```
 */
export const DATA_VERSION: string = pkg.version;
