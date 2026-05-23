import type { FieldTypeFor, MapType } from '@type-map-for/core';

/* ------------------------------------------------------------------ *
 *  @type-map-for/typesense                                            *
 *                                                                     *
 *  - Output shape:  Array<{ name, type, optional, index? }>          *
 *  - Arrays:        type suffix, e.g. string[]                       *
 *  - Optional:      optional: true                                   *
 *  - Required:      optional: false                                  *
 * ------------------------------------------------------------------ */

type TsTypeMap = {
  string:     'string';
  'string[]': 'string[]';
  int32:      'int32';
  'int32[]':  'int32[]';
  float:      'float';
  'float[]':  'float[]';
  bool:       'bool';
  'bool[]':   'bool[]';
  object:     'object';
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
