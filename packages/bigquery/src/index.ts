import type { FieldTypeFor, MapType, ItemType } from '@type-map-for/core';

/* ------------------------------------------------------------------ *
 *  @type-map-for/bigquery                                             *
 *                                                                     *
 *  - Output shape:  Array<{ name, type, mode, description? }>        *
 *  - Arrays:        mode: 'REPEATED', scalar type (no [] suffix)     *
 *  - Optional:      mode: 'NULLABLE'                                 *
 *  - Required:      mode: 'REQUIRED'                                 *
 * ------------------------------------------------------------------ */

type BqTypeMap = {
  string: 'STRING';
  int32:  'INT64';
  float:  'FLOAT';
  bool:   'BOOL';
  object: 'JSON';
};

type BqType<T> = MapType<FieldTypeFor<ItemType<T>>, BqTypeMap>;

type BqMode<T> =
  NonNullable<T> extends any[] ? 'REPEATED'
  : undefined   extends T     ? 'NULLABLE'
  : 'REQUIRED';

export type BigQueryField<T, K extends keyof T> = {
  name:         K;
  type:         BqType<T[K]>;
  mode:         BqMode<T[K]>;
  description?: string;
};

export type BigQueryFieldMap<T> = Array<{
  [K in keyof T]-?: BigQueryField<T, K>
}[keyof T]>;
