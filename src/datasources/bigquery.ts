import type { FieldTypeFor, MapType, ItemType } from '../index';

/* ------------------------------------------------------------------ *
 *  BigQuery field descriptor                                          *
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

/** The BigQuery type for a TypeScript field value.
 *  Arrays strip the [] — they're expressed via mode: REPEATED instead. */
type BqType<T> = MapType<FieldTypeFor<ItemType<T>>, BqTypeMap>;

/** REPEATED for arrays, NULLABLE for optional scalars, REQUIRED otherwise. */
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

/** Schema config object — kept for tooling / runtime inspection. */
export const BIGQUERY_SCHEMA = {
  nameKey:  'name',
  typeKey:  'type',
  modeKey:  'mode',
  typeMap:  { string:'STRING', int32:'INT64', float:'FLOAT', bool:'BOOL', object:'JSON' } as BqTypeMap,
  modeMap:  { required:'REQUIRED', optional:'NULLABLE', repeated:'REPEATED' },
} as const;
