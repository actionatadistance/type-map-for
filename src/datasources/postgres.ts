import type { FieldTypeFor, MapType } from '../index';

/* ------------------------------------------------------------------ *
 *  PostgreSQL field descriptor                                        *
 *                                                                     *
 *  - Output shape:  Array<{ column, pgType, nullable }>              *
 *  - Arrays:        pgType suffix, e.g. text[]  (no separate mode)   *
 *  - Optional:      nullable: true                                   *
 *  - Required:      nullable: false                                  *
 * ------------------------------------------------------------------ */

type PgTypeMap = {
  string:    'text';
  'string[]': 'text[]';
  int32:     'integer';
  'int32[]':  'integer[]';
  float:     'double precision';
  'float[]':  'double precision[]';
  bool:      'boolean';
  'bool[]':   'boolean[]';
  object:    'jsonb';
  'object[]': 'jsonb[]';
};

/** The Postgres type for a TypeScript field value.
 *  Array types map to their [] counterpart (e.g. text[]). */
type PgType<T> = MapType<FieldTypeFor<NonNullable<T>>, PgTypeMap>;

type PgNullable<T> = undefined extends T ? true : false;

export type PostgresField<T, K extends keyof T> = {
  column:   K;
  pgType:   PgType<T[K]>;
  nullable: PgNullable<T[K]>;
};

export type PostgresFieldMap<T> = Array<{
  [K in keyof T]-?: PostgresField<T, K>
}[keyof T]>;

/** Schema config object — kept for tooling / runtime inspection. */
export const POSTGRES_SCHEMA = {
  nameKey:  'column',
  typeKey:  'pgType',
  typeMap:  {
    string: 'text',    'string[]': 'text[]',
    int32:  'integer', 'int32[]':  'integer[]',
    float:  'double precision', 'float[]': 'double precision[]',
    bool:   'boolean', 'bool[]':  'boolean[]',
    object: 'jsonb',   'object[]': 'jsonb[]',
  } as PgTypeMap,
} as const;
