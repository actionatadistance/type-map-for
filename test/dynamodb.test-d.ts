import { it, expectTypeOf } from 'vitest';
import type { DynamoDBSchema } from '..';
import type { QobuzTrack } from './qobuz-track.d';

type Schema = DynamoDBSchema<QobuzTrack>;
type Attr<K extends keyof QobuzTrack> = Extract<Schema[number], { AttributeName: K }>;

/* ── type mappings ──────────────────────────────────────────────── */
it('string → S', () => {
  expectTypeOf<Attr<'track_title'>['AttributeType']>().toEqualTypeOf<'S'>();
});

it('optional string → S (DynamoDB has no nullable concept)', () => {
  expectTypeOf<Attr<'lyrics'>['AttributeType']>().toEqualTypeOf<'S'>();
});

it('number → N', () => {
  expectTypeOf<Attr<'popularity'>['AttributeType']>().toEqualTypeOf<'N'>();
});

it('optional number → N', () => {
  expectTypeOf<Attr<'track_number'>['AttributeType']>().toEqualTypeOf<'N'>();
});

it('boolean → BOOL', () => {
  expectTypeOf<Attr<'has_lyrics'>['AttributeType']>().toEqualTypeOf<'BOOL'>();
});

it('string array → L', () => {
  expectTypeOf<Attr<'genres'>['AttributeType']>().toEqualTypeOf<'L'>();
});

it('object array → L', () => {
  expectTypeOf<Attr<'track_main_artists'>['AttributeType']>().toEqualTypeOf<'L'>();
});

/* ── full literal construction compiles ────────────────────────── */
it('full QobuzTrack DynamoDB schema compiles', () => {
  const schema: DynamoDBSchema<QobuzTrack> = [
    { AttributeName: 'qobuz_track_id',        AttributeType: 'S'    },
    { AttributeName: 'roon_track_id',         AttributeType: 'S'    },
    { AttributeName: 'roon_album_id',         AttributeType: 'S'    },
    { AttributeName: 'roon_recording_id',     AttributeType: 'S'    },
    { AttributeName: 'track_number',          AttributeType: 'N'    },
    { AttributeName: 'roon_lyrics_id',        AttributeType: 'S'    },
    { AttributeName: 'track_title',           AttributeType: 'S'    },
    { AttributeName: 'album_title',           AttributeType: 'S'    },
    { AttributeName: 'album_artist',          AttributeType: 'S'    },
    { AttributeName: 'track_main_artists',    AttributeType: 'L'    },
    { AttributeName: 'popularity',            AttributeType: 'N'    },
    { AttributeName: 'lyrics',               AttributeType: 'S'    },
    { AttributeName: 'has_lyrics',            AttributeType: 'BOOL' },
    { AttributeName: 'genres',               AttributeType: 'L'    },
    { AttributeName: 'form',                  AttributeType: 'S'    },
    { AttributeName: 'period',               AttributeType: 'S'    },
    { AttributeName: 'composition_title',     AttributeType: 'S'    },
    { AttributeName: 'original_release_year', AttributeType: 'N'    },
    { AttributeName: 'album_labels',          AttributeType: 'L'    },
    { AttributeName: 'length_seconds',        AttributeType: 'N'    },
  ];
  expectTypeOf(schema).toMatchTypeOf<DynamoDBSchema<QobuzTrack>>();
});

/* ── negative: wrong type code ──────────────────────────────────── */
it('wrong AttributeType is rejected', () => {
  expectTypeOf<{ AttributeName: 'track_title'; AttributeType: 'N' }>()
    .not.toMatchTypeOf<Attr<'track_title'>>();
});

it('non-existent field name is rejected', () => {
  expectTypeOf<{ AttributeName: 'oops'; AttributeType: 'S' }>()
    .not.toMatchTypeOf<Schema[number]>();
});
