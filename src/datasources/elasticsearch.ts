/* ------------------------------------------------------------------ *
 *  Elasticsearch field mapping                                        *
 *                                                                     *
 *  - Output shape:  Record<fieldName, ElasticsearchField>  (object)  *
 *  - Primitives:    { type: 'text' | 'integer' | 'float' | ... }     *
 *  - Plain objects: { type: 'object',  properties: { ... } }  ←─┐   *
 *  - Object arrays: { type: 'nested',  properties: { ... } }    │   *
 *  - Prim. arrays:  { type: scalar }  (arrays implicit in ES)   │   *
 *                                                                │   *
 *  ElasticsearchField and ElasticsearchProperties are mutually ──┘   *
 *  recursive for defined (non-self-referential) types.               *
 * ------------------------------------------------------------------ */

/** True when T has specific string-literal keys — i.e. a shaped interface,
 *  not a generic `object`, `{}`, or string-indexed type. */
type IsStructured<T> =
  [keyof T] extends [never] ? false   // {} or object — no known keys
  : string extends keyof T  ? false   // string index — generic map type
  : true;

/** ES scalar type for primitive TS values. */
type EsScalarType<T> =
  T extends string  ? 'text'
  : T extends number  ? 'integer' | 'float'
  : T extends boolean ? 'boolean'
  : 'object';

/**
 * The Elasticsearch field descriptor for field K of type T.
 *
 *  - Structured object  → { type: 'object',  properties: ElasticsearchProperties<U> }
 *  - Array of structs   → { type: 'nested',  properties: ElasticsearchProperties<U> }
 *  - Primitive / array  → { type: scalar }
 */
export type ElasticsearchField<T, K extends keyof T> =
  /* ── array ──────────────────────────────────────────────────────── */
  NonNullable<T[K]> extends (infer U)[]
    ? IsStructured<U> extends true
      ? { type: 'nested'; properties: ElasticsearchProperties<U> }  // array of structs
      : { type: EsScalarType<NonNullable<U>> }                       // array of primitives
  /* ── plain structured object ─────────────────────────────────────── */
  : IsStructured<NonNullable<T[K]>> extends true
    ? { type: 'object'; properties: ElasticsearchProperties<NonNullable<T[K]>> }
  /* ── primitive / generic object fallback ────────────────────────── */
  : { type: EsScalarType<NonNullable<T[K]>> };

/**
 * Elasticsearch `mappings.properties` object for a TypeScript interface.
 * Recurses into nested structured objects and arrays of objects.
 *
 * @example
 * type Props = ElasticsearchProperties<{ title: string; album: { year: number } }>;
 * // {
 * //   title: { type: 'text' },
 * //   album: { type: 'object'; properties: { year: { type: 'integer' | 'float' } } }
 * // }
 */
export type ElasticsearchProperties<T> = {
  [K in keyof T]: ElasticsearchField<T, K>;
};
