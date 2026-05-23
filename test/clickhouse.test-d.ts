import { it, expectTypeOf } from 'vitest';
import type { ClickHouseSchema, ChType } from '..';
import type { QobuzTrack } from './qobuz-track.d';

type Schema = ClickHouseSchema<QobuzTrack>;
type Col<K extends keyof QobuzTrack> = Extract<Schema[number], { name: K }>;

/* ── required scalars ───────────────────────────────────────────── */
it('required string → String', () => {
  expectTypeOf<Col<'track_title'>['type']>().toEqualTypeOf<'String'>();
});

it('required boolean → Bool', () => {
  expectTypeOf<Col<'has_lyrics'>['type']>().toEqualTypeOf<'Bool'>();
});

it('required number → Int32 | Float64', () => {
  expectTypeOf<Col<'popularity'>['type']>().toEqualTypeOf<'Int32' | 'Float64'>();
});

/* ── optional scalars → Nullable(T) template literal ───────────── */
it('optional string → Nullable(String)', () => {
  expectTypeOf<Col<'lyrics'>['type']>().toEqualTypeOf<'Nullable(String)'>();
});

it('optional number → Nullable(Int32) | Nullable(Float64)', () => {
  expectTypeOf<Col<'track_number'>['type']>()
    .toEqualTypeOf<'Nullable(Int32)' | 'Nullable(Float64)'>();
});

/* ── arrays → Array(T) template literal ────────────────────────── */
it('optional string array → Array(String)', () => {
  expectTypeOf<Col<'genres'>['type']>().toEqualTypeOf<'Array(String)'>();
});

it('optional object array → Array(JSON)', () => {
  expectTypeOf<Col<'track_main_artists'>['type']>().toEqualTypeOf<'Array(JSON)'>();
});

/* ── ChType standalone helper ───────────────────────────────────── */
it('ChType helper works independently', () => {
  expectTypeOf<ChType<string>>().toEqualTypeOf<'String'>();
  expectTypeOf<ChType<string | undefined>>().toEqualTypeOf<'Nullable(String)'>();
  expectTypeOf<ChType<string[]>>().toEqualTypeOf<'Array(String)'>();
  expectTypeOf<ChType<number | undefined>>()
    .toEqualTypeOf<'Nullable(Int32)' | 'Nullable(Float64)'>();
});

/* ── full literal construction compiles ────────────────────────── */
it('full QobuzTrack ClickHouse schema compiles', () => {
  const schema: ClickHouseSchema<QobuzTrack> = [
    { name: 'qobuz_track_id',        type: 'String'                         },
    { name: 'roon_track_id',         type: 'String'                         },
    { name: 'roon_album_id',         type: 'String'                         },
    { name: 'roon_recording_id',     type: 'Nullable(String)'               },
    { name: 'track_number',          type: 'Nullable(Int32)'                },
    { name: 'roon_lyrics_id',        type: 'Nullable(String)'               },
    { name: 'track_title',           type: 'String'                         },
    { name: 'album_title',           type: 'String'                         },
    { name: 'album_artist',          type: 'String'                         },
    { name: 'track_main_artists',    type: 'Array(JSON)'                    },
    { name: 'popularity',            type: 'Float64'                        },
    { name: 'lyrics',                type: 'Nullable(String)'               },
    { name: 'has_lyrics',            type: 'Bool'                           },
    { name: 'genres',                type: 'Array(String)'                  },
    { name: 'form',                  type: 'Nullable(String)'               },
    { name: 'period',                type: 'Nullable(String)'               },
    { name: 'composition_title',     type: 'Nullable(String)'               },
    { name: 'original_release_year', type: 'Nullable(Int32)'                },
    { name: 'album_labels',          type: 'Array(String)'                  },
    { name: 'length_seconds',        type: 'Nullable(Int32)'                },
  ];
  expectTypeOf(schema).toMatchTypeOf<ClickHouseSchema<QobuzTrack>>();
});

/* ── negative ───────────────────────────────────────────────────── */
it('plain String rejected for optional field', () => {
  expectTypeOf<{ name: 'lyrics'; type: 'String' }>()
    .not.toMatchTypeOf<Col<'lyrics'>>();
});

it('Nullable wrapper rejected for required field', () => {
  expectTypeOf<{ name: 'track_title'; type: 'Nullable(String)' }>()
    .not.toMatchTypeOf<Col<'track_title'>>();
});
