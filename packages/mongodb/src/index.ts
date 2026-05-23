import type { RequiredKeys } from '@type-map-for/core';

/* ------------------------------------------------------------------ *
 *  @type-map-for/mongodb                                              *
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
  [K in keyof T]-?: MongoField<T, K>;
};

export type MongoSchema<T> = {
  bsonType:   'object';
  required?:  Array<RequiredKeys<T>>;
  properties: MongoProperties<T>;
};

export type { RequiredKeys } from '@type-map-for/core';
