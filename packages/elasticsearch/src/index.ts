/* ------------------------------------------------------------------ *
 *  @type-map-for/elasticsearch                                        *
 *                                                                     *
 *  - Output shape:  Record<fieldName, ElasticsearchField>  (object)  *
 *  - Primitives:    { type: 'text' | 'integer' | 'float' | ... }     *
 *  - Plain objects: { type: 'object',  properties: { ... } }         *
 *  - Object arrays: { type: 'nested',  properties: { ... } }         *
 *  - Prim. arrays:  { type: scalar }  (arrays implicit in ES)        *
 * ------------------------------------------------------------------ */

type IsStructured<T> =
  T extends (string | number | boolean | null | undefined) ? false  // primitives first
  : [keyof T] extends [never] ? false                               // {} or object
  : string extends keyof T    ? false                               // string-indexed
  : true;

type EsScalarType<T> =
  T extends string  ? 'text'
  : T extends number  ? 'integer' | 'float'
  : T extends boolean ? 'boolean'
  : 'object';

export type ElasticsearchField<T, K extends keyof T> =
  NonNullable<T[K]> extends (infer U)[]
    ? IsStructured<U> extends true
      ? { type: 'nested'; properties: ElasticsearchProperties<U> }
      : { type: EsScalarType<NonNullable<U>> }
  : IsStructured<NonNullable<T[K]>> extends true
    ? { type: 'object'; properties: ElasticsearchProperties<NonNullable<T[K]>> }
  : { type: EsScalarType<NonNullable<T[K]>> };

export type ElasticsearchProperties<T> = {
  [K in keyof T]-?: ElasticsearchField<T, K>;
};
