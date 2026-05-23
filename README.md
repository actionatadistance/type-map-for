# type-map-for

Compile-time schema validation for TypeScript interfaces.

Write your schema once against your TypeScript interface — the wrong type name, wrong mode, wrong field name, or missing field is a **type error before it ever runs**.

```typescript
interface Track {
  id:       string;
  title:    string;
  duration: number;
  genres?:  string[];
}

const schema: BigQueryFieldMap<Track> = [
  { name: 'id',       type: 'STRING', mode: 'REQUIRED' },
  { name: 'title',    type: 'STRING', mode: 'REQUIRED' },
  { name: 'duration', type: 'FLOAT',  mode: 'REQUIRED' },
  { name: 'genres',   type: 'STRING', mode: 'REPEATED' },

  { name: 'genres',   type: 'STRING', mode: 'REQUIRED' }, // ❌ genres is optional — must be REPEATED
  { name: 'title',    type: 'INT64',  mode: 'REQUIRED' }, // ❌ string field can't be INT64
  { name: 'oops',     type: 'STRING', mode: 'REQUIRED' }, // ❌ 'oops' is not a key of Track
];
```

No codegen. No runtime. Pure TypeScript types.

---

## Supported datasources

| Datasource | Output shape | Arrays | Optional |
|---|---|---|---|
| **BigQuery** | `Array<{name, type, mode}>` | `mode: 'REPEATED'` | `mode: 'NULLABLE'` |
| **PostgreSQL** | `Array<{column, pgType, nullable}>` | `text[]` suffix | `nullable: true` |
| **Typesense** | `Array<{name, type, optional}>` | `string[]` suffix | `optional: true` |
| **Elasticsearch** | `Record<field, {type, ...}>` | Scalar element type (implicit) | Not expressed |
| **Avro** | `{type: 'record', fields: [...]}` | `{type:'array', items:T}` | `['null', T]` |
| **DynamoDB** | `Array<{AttributeName, AttributeType}>` | `'L'` | Not expressed |
| **ClickHouse** | `Array<{name, type}>` | `` Array(T) `` | `` Nullable(T) `` |
| **MongoDB** | `{bsonType:'object', required?, properties}` | `'array'` | Via `required` array |

---

## Install

```bash
npm install type-map-for
```

---

## Usage

### BigQuery

Arrays become `mode: 'REPEATED'` — the type stays scalar. Optional scalars get `mode: 'NULLABLE'`.

```typescript
import type { BigQueryFieldMap } from 'type-map-for';

interface Track {
  id:       string;
  title:    string;
  plays?:   number;
  genres?:  string[];
}

const fields: BigQueryFieldMap<Track> = [
  { name: 'id',     type: 'STRING', mode: 'REQUIRED' },
  { name: 'title',  type: 'STRING', mode: 'REQUIRED' },
  { name: 'plays',  type: 'FLOAT',  mode: 'NULLABLE' },
  { name: 'genres', type: 'STRING', mode: 'REPEATED' },
];
```

### PostgreSQL

Arrays append a `[]` suffix to the type. Optionality is a boolean.

```typescript
import type { PostgresFieldMap } from 'type-map-for';

const columns: PostgresFieldMap<Track> = [
  { column: 'id',     pgType: 'text',   nullable: false },
  { column: 'title',  pgType: 'text',   nullable: false },
  { column: 'plays',  pgType: 'double precision', nullable: true },
  { column: 'genres', pgType: 'text[]', nullable: true  },
];
```

### Typesense

Type names mirror TypeScript conventions (`string`, `int32`, `float`, `bool`). Arrays keep the `[]` suffix.

```typescript
import type { TypesenseFieldMap } from 'type-map-for';

const fields: TypesenseFieldMap<Track> = [
  { name: 'id',     type: 'string',   optional: false },
  { name: 'title',  type: 'string',   optional: false },
  { name: 'plays',  type: 'float',    optional: true  },
  { name: 'genres', type: 'string[]', optional: true  },
];
```

### Elasticsearch

Output is a **keyed object**, not an array. Arrays are implicit — any ES field can hold multiple values, so `string[]` maps to the same `text` descriptor as `string`.

Nested structured objects recurse automatically: plain objects become `type: 'object'` with `properties`, arrays of objects become `type: 'nested'` with `properties`.

```typescript
import type { ElasticsearchProperties } from 'type-map-for';

interface Album {
  title:       string;
  lead_artist: { name: string; mbid?: string };  // plain object → 'object'
  tracks:      { title: string; duration: number }[];  // object array → 'nested'
  genres?:     string[];  // string array → 'text' (implicit)
}

const properties: ElasticsearchProperties<Album> = {
  title:       { type: 'text' },
  lead_artist: {
    type: 'object',
    properties: {
      name: { type: 'text' },
      mbid: { type: 'text' },
    },
  },
  tracks: {
    type: 'nested',
    properties: {
      title:    { type: 'text'    },
      duration: { type: 'integer' },
    },
  },
  genres: { type: 'text' },
};

await client.indices.create({ index: 'albums', mappings: { properties } });
```

### Avro

Optional fields become `['null', T]` union types. Arrays become `{ type: 'array', items: T }` objects. Both compose: an optional array is `['null', { type: 'array', items: 'string' }]`.

```typescript
import type { AvroSchema } from 'type-map-for';

const schema: AvroSchema<Track> = {
  type: 'record',
  fields: [
    { name: 'id',     type: 'string'                                   },
    { name: 'title',  type: 'string'                                   },
    { name: 'plays',  type: ['null', 'double']                         },
    { name: 'genres', type: ['null', { type: 'array', items: 'string' }] },
  ],
};
```

### DynamoDB

The coarsest type system: `S`, `N`, `BOOL`, `L` (list), `M` (map). All fields are nullable by default — DynamoDB is schemaless for non-key attributes.

```typescript
import type { DynamoDBSchema } from 'type-map-for';

const attrs: DynamoDBSchema<Track> = [
  { AttributeName: 'id',     AttributeType: 'S' },
  { AttributeName: 'title',  AttributeType: 'S' },
  { AttributeName: 'plays',  AttributeType: 'N' },
  { AttributeName: 'genres', AttributeType: 'L' },
];
```

### ClickHouse

Optionality and arrays are expressed as **template literal type wrappers** — `Nullable(String)`, `Array(String)`, and they compose the way you'd expect.

```typescript
import type { ClickHouseSchema } from 'type-map-for';

const columns: ClickHouseSchema<Track> = [
  { name: 'id',     type: 'String'           },
  { name: 'title',  type: 'String'           },
  { name: 'plays',  type: 'Nullable(Float64)' },
  { name: 'genres', type: 'Array(String)'    },
];
```

### MongoDB

Output is a `$jsonSchema` validator object. The `required` array only accepts non-optional keys of your interface — TypeScript rejects optional field names and typos.

```typescript
import type { MongoSchema } from 'type-map-for';

const schema: MongoSchema<Track> = {
  bsonType: 'object',
  required: ['id', 'title'],   // ❌ 'plays' or 'genres' here would be a type error
  properties: {
    id:     { bsonType: 'string' },
    title:  { bsonType: 'string' },
    plays:  { bsonType: 'double' },
    genres: { bsonType: 'array'  },
  },
};
```

---

## How it works

The library exposes a small set of type primitives that each datasource module builds on:

```typescript
// Infers a canonical type from a TypeScript value type
type FieldTypeFor<T> =
  T extends string  ? 'string'
  : T extends number  ? 'int32' | 'float'
  : T extends boolean ? 'bool'
  : T extends (infer U)[] ? `${FieldTypeFor<U>}[]`
  : 'object';

// Translates a canonical type via a lookup map
type MapType<FT extends string, M extends Record<string, string>> =
  FT extends keyof M ? M[FT] : FT;
```

Each datasource defines its own output types on top of these — no shared config object, no baroque parameterization. Elasticsearch's `Record<K, {type}>` output and Avro's `['null', T]` unions are just regular TypeScript types that happen to use the same underlying inference.

---

## The `number` ambiguity

TypeScript's `number` covers both integers and floats. `FieldTypeFor<number>` returns `'int32' | 'float'` — a union. This means numeric fields resolve to a union of target types (e.g. `'INT64' | 'FLOAT'` in BigQuery, `'integer' | 'double precision'` in Postgres).

To pin a specific type, use `typeNameMap` overrides or, for unambiguous integers, use `bigint` (`42n`) which maps to `int64` in supporting datasources.

---

## Testing

Tests are compile-time type assertions using [Vitest](https://vitest.dev/) `expectTypeOf`:

```bash
npm test      # vitest run --typecheck
npm run build # tsc
```

84 type tests across 8 datasources.

---

## License

ASKME
