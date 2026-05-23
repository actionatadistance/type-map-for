/* ------------------------------------------------------------------ *
 *  MongoDB JSON Schema validator                                      *
 *                                                                     *
 *  - Output shape:  { bsonType: 'object', required?, properties }    *
 *  - Arrays:        { bsonType: 'array' }                            *
 *  - Optional:      omitted from the `required` array                *
 *  - Required:      included in the `required` array                 *
 * ------------------------------------------------------------------ */

type MongoBsonType<T> =
  NonNullable<T> extends string  ? 'string'
  : NonNullable<T> extends number  ? 'int' | 'double'
  : NonNullable<T> extends boolean ? 'bool'
  : NonNullable<T> extends any[]   ? 'array'
  : 'object';

export type MongoField<T, K extends keyof T> = {
  bsonType: MongoBsonType<T[K]>;
};

export type MongoProperties<T> = {
  [K in keyof T]: MongoField<T, K>;
};

/** Keys of T where the value is not optional (no undefined). */
export type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

/**
 * MongoDB $jsonSchema validator object.
 *
 * `required` accepts any subset of the non-optional keys of T —
 * TypeScript rejects optional field names and non-existent field names.
 *
 * @example
 * type Schema = MongoSchema<{ id: string; title?: string }>;
 * // {
 * //   bsonType: 'object',
 * //   required?: Array<'id'>,   // 'title' not allowed here — it's optional
 * //   properties: {
 * //     id:    { bsonType: 'string' },
 * //     title: { bsonType: 'string' },
 * //   }
 * // }
 */
export type MongoSchema<T> = {
  bsonType:    'object';
  required?:   Array<RequiredKeys<T>>;
  properties:  MongoProperties<T>;
};
