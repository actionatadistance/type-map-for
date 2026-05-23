/* ------------------------------------------------------------------ *
 *  @type-map-for/dynamodb                                             *
 *                                                                     *
 *  - Output shape:  Array<{ AttributeName, AttributeType }>          *
 *  - Type system:   S | N | BOOL | L (list) | M (map)               *
 *  - Optionality:   not expressed — DynamoDB is schemaless for       *
 *                   non-key attributes                                *
 * ------------------------------------------------------------------ */

export type DdbAttributeType = 'S' | 'N' | 'BOOL' | 'L' | 'M';

type DdbType<T> =
  NonNullable<T> extends string  ? 'S'
  : NonNullable<T> extends number  ? 'N'
  : NonNullable<T> extends boolean ? 'BOOL'
  : NonNullable<T> extends any[]   ? 'L'
  : 'M';

export type DynamoDBField<T, K extends keyof T> = {
  AttributeName: K;
  AttributeType: DdbType<T[K]>;
};

export type DynamoDBSchema<T> = Array<{
  [K in keyof T]-?: DynamoDBField<T, K>
}[keyof T]>;
