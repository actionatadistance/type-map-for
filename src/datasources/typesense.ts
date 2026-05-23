import type { FieldTypeFor, MapType } from '../index';

/* ------------------------------------------------------------------ *
 *  Typesense field descriptor                                         *
 *                                                                     *
 *  - Output shape:  Array<{ name, type, optional, index? }>          *
 *  - Arrays:        type suffix, e.g. string[]  (same as TS)         *
 *  - Optional:      optional: true                                   *
 *  - Required:      optional: false                                  *
 * ------------------------------------------------------------------ */

type TsTypeMap = {
  string:    'string';
  'string[]': 'string[]';
  int32:     'int32';
  'int32[]':  'int32[]';
  float:     'float';
  'float[]':  'float[]';
  bool:      'bool';
  'bool[]':   'bool[]';
  object:    'object';
  'object[]': 'object[]';
};

type TsType<T>     = MapType<FieldTypeFor<NonNullable<T>>, TsTypeMap>;
type TsOptional<T> = undefined extends T ? true : false;

export type TypesenseField<T, K extends keyof T> = {
  name:     K;
  type:     TsType<T[K]>;
  optional: TsOptional<T[K]>;
  index?:   boolean;
};

export type TypesenseFieldMap<T> = Array<{
  [K in keyof T]-?: TypesenseField<T, K>
}[keyof T]>;

/** Schema config object — kept for tooling / runtime inspection. */
export const TYPESENSE_SCHEMA = {
  nameKey: 'name',
  typeKey: 'type',
  typeMap: {
    string: 'string',    'string[]': 'string[]',
    int32:  'int32',     'int32[]':  'int32[]',
    float:  'float',     'float[]':  'float[]',
    bool:   'bool',      'bool[]':   'bool[]',
    object: 'object',    'object[]': 'object[]',
  } as TsTypeMap,
} as const;
