/* ------------------------------------------------------------------ *
 *  ClickHouse column schema                                           *
 *                                                                     *
 *  - Output shape:  Array<{ name, type }>                            *
 *  - Arrays:        Array(T)     — template literal type             *
 *  - Optional:      Nullable(T)  — template literal type             *
 *  - Required:      plain type string, e.g. 'String'                 *
 *                                                                     *
 *  ClickHouse array+optional: Array(T) is never Nullable in CH —     *
 *  use DEFAULT [] instead. We express optional arrays as             *
 *  Array(T) (nullable arrays aren't idiomatic in ClickHouse).        *
 * ------------------------------------------------------------------ */

type ChBaseType<T> =
  NonNullable<T> extends string  ? 'String'
  : NonNullable<T> extends number  ? 'Int32' | 'Float64'
  : NonNullable<T> extends boolean ? 'Bool'
  : 'JSON';  // objects → ClickHouse JSON type

/**
 * ClickHouse column type for a TypeScript field value.
 *
 *  required scalar   → 'String'
 *  optional scalar   → 'Nullable(String)'
 *  required array    → 'Array(String)'
 *  optional array    → 'Array(String)'  (nullable arrays not idiomatic in CH)
 */
export type ChType<T> =
  NonNullable<T> extends (infer U)[]
    ? `Array(${ChBaseType<NonNullable<U>>})`
    : undefined extends T
      ? `Nullable(${ChBaseType<T>})`
      : ChBaseType<T>;

export type ClickHouseField<T, K extends keyof T> = {
  name: K;
  type: ChType<T[K]>;
};

export type ClickHouseSchema<T> = Array<{
  [K in keyof T]-?: ClickHouseField<T, K>
}[keyof T]>;
