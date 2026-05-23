import { it, expectTypeOf } from 'vitest';
import type { PostgresFieldMap } from '@type-map-for/postgres';
import type { QobuzTrack } from '../../../test/fixtures/qobuz-track.d';

type PgMap = PostgresFieldMap<QobuzTrack>;
type PgField<K extends keyof QobuzTrack> = Extract<PgMap[number], { column: K }>;

it('required string → text, not nullable', () => {
  expectTypeOf<PgField<'track_title'>['pgType']>().toEqualTypeOf<'text'>();
  expectTypeOf<PgField<'track_title'>['nullable']>().toEqualTypeOf<false>();
});

it('optional string → text, nullable', () => {
  expectTypeOf<PgField<'lyrics'>['pgType']>().toEqualTypeOf<'text'>();
  expectTypeOf<PgField<'lyrics'>['nullable']>().toEqualTypeOf<true>();
});

it('optional string array → text[], nullable', () => {
  expectTypeOf<PgField<'genres'>['pgType']>().toEqualTypeOf<'text[]'>();
  expectTypeOf<PgField<'genres'>['nullable']>().toEqualTypeOf<true>();
});

it('optional object array → jsonb[], nullable', () => {
  expectTypeOf<PgField<'track_main_artists'>['pgType']>().toEqualTypeOf<'jsonb[]'>();
  expectTypeOf<PgField<'track_main_artists'>['nullable']>().toEqualTypeOf<true>();
});

it('boolean → boolean, not nullable', () => {
  expectTypeOf<PgField<'has_lyrics'>['pgType']>().toEqualTypeOf<'boolean'>();
  expectTypeOf<PgField<'has_lyrics'>['nullable']>().toEqualTypeOf<false>();
});

it('number → integer | double precision (ambiguous)', () => {
  expectTypeOf<PgField<'popularity'>['pgType']>()
    .toEqualTypeOf<'integer' | 'double precision'>();
});

it('full QobuzTrack map compiles', () => {
  const map: PgMap = [
    { column: 'qobuz_track_id',        pgType: 'text',             nullable: false },
    { column: 'roon_track_id',         pgType: 'text',             nullable: false },
    { column: 'roon_album_id',         pgType: 'text',             nullable: false },
    { column: 'roon_recording_id',     pgType: 'text',             nullable: true  },
    { column: 'track_number',          pgType: 'integer',          nullable: true  },
    { column: 'roon_lyrics_id',        pgType: 'text',             nullable: true  },
    { column: 'track_title',           pgType: 'text',             nullable: false },
    { column: 'album_title',           pgType: 'text',             nullable: false },
    { column: 'album_artist',          pgType: 'text',             nullable: false },
    { column: 'track_main_artists',    pgType: 'jsonb[]',          nullable: true  },
    { column: 'popularity',            pgType: 'double precision', nullable: false },
    { column: 'lyrics',                pgType: 'text',             nullable: true  },
    { column: 'has_lyrics',            pgType: 'boolean',          nullable: false },
    { column: 'genres',                pgType: 'text[]',           nullable: true  },
    { column: 'form',                  pgType: 'text',             nullable: true  },
    { column: 'period',                pgType: 'text',             nullable: true  },
    { column: 'composition_title',     pgType: 'text',             nullable: true  },
    { column: 'original_release_year', pgType: 'integer',          nullable: true  },
    { column: 'album_labels',          pgType: 'text[]',           nullable: true  },
    { column: 'length_seconds',        pgType: 'integer',          nullable: true  },
  ];
  expectTypeOf(map).toMatchTypeOf<PgMap>();
});

it('nullable: true on a required field is rejected', () => {
  expectTypeOf<{ column: 'track_title'; pgType: 'text'; nullable: true }>()
    .not.toMatchTypeOf<PgField<'track_title'>>();
});

it('wrong pgType is rejected', () => {
  expectTypeOf<{ column: 'has_lyrics'; pgType: 'text'; nullable: false }>()
    .not.toMatchTypeOf<PgField<'has_lyrics'>>();
});
