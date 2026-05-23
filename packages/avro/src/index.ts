import type { FieldTypeFor, MapType } from '@type-map-for/core';

/* ------------------------------------------------------------------ *
 *  @type-map-for/avro                                                 *
 *                                                                     *
 *  - Output shape:  { type: 'record', fields: Array<AvroField> }     *
 *  - Arrays:        { type: 'array', items: scalarType }             *
 *  - Optional:      ['null', T]  (Avro union with null)              *
 *  - Required:      plain scalar string, e.g. 'string'               *
 * ------------------------------------------------------------------ */

type AvroTypeMap = {
  string: 'string';
  int32:  'int';
  float:  'double';
  bool:   'boolean';
  object: 'bytes';
};

type AvroScalar<T> = MapType<FieldTypeFor<T>, AvroTypeMap>;

export type AvroType<T> =
  NonNullable<T> extends (infer U)[]
    ? undefined extends T
      ? ['null', { type: 'array'; items: AvroScalar<NonNullable<U>> }]
      : { type: 'array'; items: AvroScalar<NonNullable<U>> }
    : undefined extends T
      ? ['null', AvroScalar<NonNullable<T>>]
      : AvroScalar<NonNullable<T>>;

export type AvroField<T, K extends keyof T> = {
  name: K;
  type: AvroType<T[K]>;
};

export type AvroSchema<T> = {
  type:   'record';
  fields: Array<{ [K in keyof T]-?: AvroField<T, K> }[keyof T]>;
};
