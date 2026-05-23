/* ------------------------------------------------------------------ *
 *  @type-map-for/core                                                 *
 *  Compile-time field-mapping primitives                              *
 * ------------------------------------------------------------------ */

/* === Canonical base field types ----------------------------------- */
export type BaseFieldType =
  | 'string'
  | 'int32'
  | 'float'
  | 'bool'
  | 'object'
  | string;   // allow custom user-literals

export type FieldType = BaseFieldType | `${BaseFieldType}[]`;

/* === Infer canonical type from a TypeScript type ------------------ *
 *
 *  number → 'int32' | 'float'  (TS can't distinguish; use bigint for int64)
 *  Distributive over unions, so FieldTypeFor<string | undefined> = 'string'.
 * ------------------------------------------------------------------ */
export type FieldTypeFor<T> =
  T extends (infer U)[]
    ? `${FieldTypeFor<U>}[]`
    : T extends string    ? 'string'
    : T extends number    ? 'int32' | 'float'
    : T extends boolean   ? 'bool'
    : T extends object    ? 'object'
    : never;

/* === Translate a canonical type using a lookup map ---------------- */
export type MapType<
  FT extends string,
  M extends Record<string, string>
> = FT extends keyof M ? M[FT] : FT;

/* === Field shape utilities ---------------------------------------- */

/** True if T (ignoring undefined) is an array type. */
export type IsArray<T> = NonNullable<T> extends any[] ? true : false;

/** True if T can be undefined (i.e. optional field). */
export type IsOptional<T> = undefined extends T ? true : false;

/** Inner element type of an array, stripping undefined. */
export type ItemType<T> =
  NonNullable<T> extends (infer U)[] ? U : NonNullable<T>;

/** Non-optional keys of T. */
export type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
