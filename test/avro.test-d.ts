import { it, expectTypeOf } from 'vitest';
import type { AvroSchema, AvroType } from '..';
import type { QobuzTrack } from './qobuz-track.d';

type Schema = AvroSchema<QobuzTrack>;
type Field<K extends keyof QobuzTrack> = Extract<Schema['fields'][number], { name: K }>;

/* ── required scalar → plain type string ───────────────────────── */
it('required string → plain "string"', () => {
  expectTypeOf<Field<'track_title'>['type']>().toEqualTypeOf<'string'>();
});

/* ── optional scalar → ['null', T] union ───────────────────────── */
it('optional string → ["null", "string"]', () => {
  expectTypeOf<Field<'lyrics'>['type']>().toEqualTypeOf<['null', 'string']>();
});

it('optional number → ["null", "int" | "double"]', () => {
  expectTypeOf<Field<'track_number'>['type']>()
    .toEqualTypeOf<['null', 'int' | 'double']>();
});

/* ── required array → { type: 'array', items: T } ──────────────── */
it('optional string array → ["null", { type: "array", items: "string" }]', () => {
  expectTypeOf<Field<'genres'>['type']>()
    .toEqualTypeOf<['null', { type: 'array'; items: 'string' }]>();
});

it('optional object array → ["null", { type: "array", items: "bytes" }]', () => {
  expectTypeOf<Field<'track_main_artists'>['type']>()
    .toEqualTypeOf<['null', { type: 'array'; items: 'bytes' }]>();
});

/* ── boolean ───────────────────────────────────────────────────── */
it('required boolean → "boolean"', () => {
  expectTypeOf<Field<'has_lyrics'>['type']>().toEqualTypeOf<'boolean'>();
});

/* ── output is a record with a fields array ─────────────────────── */
it('schema has type: record and a fields array', () => {
  expectTypeOf<Schema['type']>().toEqualTypeOf<'record'>();
  expectTypeOf<Schema['fields']>().toMatchTypeOf<Array<{ name: keyof QobuzTrack }>>();
});

/* ── full literal construction compiles ────────────────────────── */
it('full QobuzTrack Avro schema compiles', () => {
  const schema: AvroSchema<QobuzTrack> = {
    type: 'record',
    fields: [
      { name: 'qobuz_track_id',        type: 'string'                              },
      { name: 'roon_track_id',         type: 'string'                              },
      { name: 'roon_album_id',         type: 'string'                              },
      { name: 'roon_recording_id',     type: ['null', 'string']                    },
      { name: 'track_number',          type: ['null', 'int']                       },
      { name: 'roon_lyrics_id',        type: ['null', 'string']                    },
      { name: 'track_title',           type: 'string'                              },
      { name: 'album_title',           type: 'string'                              },
      { name: 'album_artist',          type: 'string'                              },
      { name: 'track_main_artists',    type: ['null', { type: 'array', items: 'bytes'   }] },
      { name: 'popularity',            type: 'double'                              },
      { name: 'lyrics',                type: ['null', 'string']                    },
      { name: 'has_lyrics',            type: 'boolean'                             },
      { name: 'genres',                type: ['null', { type: 'array', items: 'string' }] },
      { name: 'form',                  type: ['null', 'string']                    },
      { name: 'period',                type: ['null', 'string']                    },
      { name: 'composition_title',     type: ['null', 'string']                    },
      { name: 'original_release_year', type: ['null', 'int']                       },
      { name: 'album_labels',          type: ['null', { type: 'array', items: 'string' }] },
      { name: 'length_seconds',        type: ['null', 'int']                       },
    ],
  };
  expectTypeOf(schema).toMatchTypeOf<AvroSchema<QobuzTrack>>();
});

/* ── negative: plain type where union expected ──────────────────── */
it('plain string rejected for optional field', () => {
  expectTypeOf<{ name: 'lyrics'; type: 'string' }>()
    .not.toMatchTypeOf<Field<'lyrics'>>();
});

/* ── standalone AvroType helper ─────────────────────────────────── */
it('AvroType standalone helper works', () => {
  expectTypeOf<AvroType<string>>().toEqualTypeOf<'string'>();
  expectTypeOf<AvroType<string | undefined>>().toEqualTypeOf<['null', 'string']>();
  expectTypeOf<AvroType<string[]>>()
    .toEqualTypeOf<{ type: 'array'; items: 'string' }>();
});
