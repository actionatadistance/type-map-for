/* ------------------------------------------------------------------ *
 *  @type-map-for/clickhouse                                           *
 *                                                                     *
 *  - Output shape:  Array<{ name, type }>                            *
 *  - Arrays:        Array(T)     — template literal type             *
 *  - Optional:      Nullable(T)  — template literal type             *
 *  - Required:      plain type string, e.g. 'String'                 *
 * ------------------------------------------------------------------ */

type ChBaseType<T> =
  NonNullable<T> extends string  ? 'String'
  : NonNullable<T> extends number  ? 'Int32' | 'Float64'
  : NonNullable<T> extends boolean ? 'Bool'
  : 'JSON';

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
