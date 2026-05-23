import { it, expectTypeOf } from 'vitest';
import type { MongoSchema, RequiredKeys } from '..';
import type { QobuzTrack } from './qobuz-track.d';

type Schema = MongoSchema<QobuzTrack>;

/* ── top-level shape ────────────────────────────────────────────── */
it('schema has bsonType: object', () => {
  expectTypeOf<Schema['bsonType']>().toEqualTypeOf<'object'>();
});

/* ── bsonType mappings ──────────────────────────────────────────── */
it('required string → string', () => {
  expectTypeOf<Schema['properties']['track_title']['bsonType']>()
    .toEqualTypeOf<'string'>();
});

it('optional string → string (bsonType same; optionality via required array)', () => {
  expectTypeOf<Schema['properties']['lyrics']['bsonType']>()
    .toEqualTypeOf<'string'>();
});

it('number → int | double', () => {
  expectTypeOf<Schema['properties']['popularity']['bsonType']>()
    .toEqualTypeOf<'int' | 'double'>();
});

it('boolean → bool', () => {
  expectTypeOf<Schema['properties']['has_lyrics']['bsonType']>()
    .toEqualTypeOf<'bool'>();
});

it('string array → array', () => {
  expectTypeOf<Schema['properties']['genres']['bsonType']>()
    .toEqualTypeOf<'array'>();
});

it('object array → array', () => {
  expectTypeOf<Schema['properties']['track_main_artists']['bsonType']>()
    .toEqualTypeOf<'array'>();
});

/* ── required array only allows non-optional keys ──────────────── */
it('RequiredKeys only includes non-optional fields', () => {
  type RK = RequiredKeys<QobuzTrack>;
  // These required fields should be assignable to RK
  expectTypeOf<'track_title'>().toMatchTypeOf<RK>();
  expectTypeOf<'has_lyrics'>().toMatchTypeOf<RK>();
  expectTypeOf<'qobuz_track_id'>().toMatchTypeOf<RK>();
  // These optional fields must NOT be assignable to RK
  expectTypeOf<RK>().not.toMatchTypeOf<'lyrics'>();
  expectTypeOf<RK>().not.toMatchTypeOf<'genres'>();
  expectTypeOf<RK>().not.toMatchTypeOf<'track_number'>();
});

/* ── full literal construction compiles ────────────────────────── */
it('full QobuzTrack MongoDB schema compiles', () => {
  const schema: MongoSchema<QobuzTrack> = {
    bsonType: 'object',
    required: ['qobuz_track_id', 'roon_track_id', 'roon_album_id',
               'track_title', 'album_title', 'album_artist',
               'popularity', 'has_lyrics'],
    properties: {
      qobuz_track_id:        { bsonType: 'string' },
      roon_track_id:         { bsonType: 'string' },
      roon_album_id:         { bsonType: 'string' },
      roon_recording_id:     { bsonType: 'string' },
      track_number:          { bsonType: 'int'    },
      roon_lyrics_id:        { bsonType: 'string' },
      track_title:           { bsonType: 'string' },
      album_title:           { bsonType: 'string' },
      album_artist:          { bsonType: 'string' },
      track_main_artists:    { bsonType: 'array'  },
      popularity:            { bsonType: 'double' },
      lyrics:                { bsonType: 'string' },
      has_lyrics:            { bsonType: 'bool'   },
      genres:                { bsonType: 'array'  },
      form:                  { bsonType: 'string' },
      period:                { bsonType: 'string' },
      composition_title:     { bsonType: 'string' },
      original_release_year: { bsonType: 'int'    },
      album_labels:          { bsonType: 'array'  },
      length_seconds:        { bsonType: 'int'    },
    },
  };
  expectTypeOf(schema).toMatchTypeOf<MongoSchema<QobuzTrack>>();
});

/* ── negative: optional key in required array is rejected ───────── */
it('optional key in required array is rejected', () => {
  expectTypeOf<Array<'lyrics'>>()
    .not.toMatchTypeOf<Schema['required']>();
});

it('non-existent key in required array is rejected', () => {
  expectTypeOf<Array<'oops'>>()
    .not.toMatchTypeOf<Schema['required']>();
});
