/* ------------------------------------------------------------------ *
 *  Amazon DynamoDB attribute schema                                  *
 *                                                                     *
 *  - Output shape:  Array<{ AttributeName, AttributeType }>          *
 *  - Type system:   S (string) | N (number) | BOOL | L (list) | M   *
 *  - Optionality:   not expressed — DynamoDB is schemaless for       *
 *                   non-key attributes; all fields are nullable       *
 * ------------------------------------------------------------------ */

/** DynamoDB attribute type codes. */
export type DdbAttributeType =
  | 'S'     // String
  | 'N'     // Number (all numeric types)
  | 'BOOL'  // Boolean
  | 'L'     // List  (any array)
  | 'M';    // Map   (any object)

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

/**
 * DynamoDB-style attribute definition array.
 * Optionality is not expressed — DynamoDB treats all non-key attributes
 * as optional by default.
 *
 * @example
 * type Attrs = DynamoDBSchema<{ id: string; count: number; tags: string[] }>;
 * // Array<
 * //   | { AttributeName: 'id',    AttributeType: 'S' }
 * //   | { AttributeName: 'count', AttributeType: 'N' }
 * //   | { AttributeName: 'tags',  AttributeType: 'L' }
 * // >
 */
export type DynamoDBSchema<T> = Array<{
  [K in keyof T]-?: DynamoDBField<T, K>
}[keyof T]>;
