import type { FieldTypeFor, MapType } from '@type-map-for/core';

/* ------------------------------------------------------------------ *
 *  @type-map-for/postgres                                             *
 *                                                                     *
 *  - Output shape:  Array<{ column, pgType, nullable }>              *
 *  - Arrays:        pgType suffix, e.g. text[]                       *
 *  - Optional:      nullable: true                                   *
 *  - Required:      nullable: false                                  *
 * ------------------------------------------------------------------ */

type PgTypeMap = {
  string:     'text';
  'string[]': 'text[]';
  int32:      'integer';
  'int32[]':  'integer[]';
  float:      'double precision';
  'float[]':  'double precision[]';
  bool:       'boolean';
  'bool[]':   'boolean[]';
  object:     'jsonb';
  'object[]': 'jsonb[]';
};

type PgType<T>     = MapType<FieldTypeFor<NonNullable<T>>, PgTypeMap>;
type PgNullable<T> = undefined extends T ? true : false;

export type PostgresField<T, K extends keyof T> = {
  column:   K;
  pgType:   PgType<T[K]>;
  nullable: PgNullable<T[K]>;
};

export type PostgresFieldMap<T> = Array<{
  [K in keyof T]-?: PostgresField<T, K>
}[keyof T]>;
