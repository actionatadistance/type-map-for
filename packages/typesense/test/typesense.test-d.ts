import { it, expectTypeOf } from 'vitest';
import type { TypesenseFieldMap } from '@type-map-for/typesense';
import type { QobuzTrack } from '../../../test/fixtures/qobuz-track.d';

type TsMap = TypesenseFieldMap<QobuzTrack>;
type TsField<K extends keyof QobuzTrack> = Extract<TsMap[number], { name: K }>;

it('required string → string, not optional', () => {
  expectTypeOf<TsField<'track_title'>['type']>().toEqualTypeOf<'string'>();
  expectTypeOf<TsField<'track_title'>['optional']>().toEqualTypeOf<false>();
});

it('optional string → string, optional', () => {
  expectTypeOf<TsField<'lyrics'>['type']>().toEqualTypeOf<'string'>();
  expectTypeOf<TsField<'lyrics'>['optional']>().toEqualTypeOf<true>();
});

it('optional string array → string[], optional', () => {
  expectTypeOf<TsField<'genres'>['type']>().toEqualTypeOf<'string[]'>();
  expectTypeOf<TsField<'genres'>['optional']>().toEqualTypeOf<true>();
});

it('optional object array → object[], optional', () => {
  expectTypeOf<TsField<'track_main_artists'>['type']>().toEqualTypeOf<'object[]'>();
  expectTypeOf<TsField<'track_main_artists'>['optional']>().toEqualTypeOf<true>();
});

it('boolean → bool, not optional', () => {
  expectTypeOf<TsField<'has_lyrics'>['type']>().toEqualTypeOf<'bool'>();
  expectTypeOf<TsField<'has_lyrics'>['optional']>().toEqualTypeOf<false>();
});

it('index is always optional on every field', () => {
  expectTypeOf<TsField<'track_title'>['index']>().toEqualTypeOf<boolean | undefined>();
});

it('full QobuzTrack map compiles', () => {
  const map: TsMap = [
    { name: 'qobuz_track_id',        type: 'string',   optional: false, index: true  },
    { name: 'roon_track_id',         type: 'string',   optional: false               },
    { name: 'roon_album_id',         type: 'string',   optional: false               },
    { name: 'roon_recording_id',     type: 'string',   optional: true                },
    { name: 'track_number',          type: 'int32',    optional: true                },
    { name: 'roon_lyrics_id',        type: 'string',   optional: true                },
    { name: 'track_title',           type: 'string',   optional: false, index: true  },
    { name: 'album_title',           type: 'string',   optional: false               },
    { name: 'album_artist',          type: 'string',   optional: false               },
    { name: 'track_main_artists',    type: 'object[]', optional: true                },
    { name: 'popularity',            type: 'float',    optional: false               },
    { name: 'lyrics',                type: 'string',   optional: true                },
    { name: 'has_lyrics',            type: 'bool',     optional: false               },
    { name: 'genres',                type: 'string[]', optional: true                },
    { name: 'form',                  type: 'string',   optional: true                },
    { name: 'period',                type: 'string',   optional: true                },
    { name: 'composition_title',     type: 'string',   optional: true                },
    { name: 'original_release_year', type: 'int32',    optional: true                },
    { name: 'album_labels',          type: 'string[]', optional: true                },
    { name: 'length_seconds',        type: 'int32',    optional: true                },
  ];
  expectTypeOf(map).toMatchTypeOf<TsMap>();
});

it('optional: true on a required field is rejected', () => {
  expectTypeOf<{ name: 'track_title'; type: 'string'; optional: true }>()
    .not.toMatchTypeOf<TsField<'track_title'>>();
});

it('wrong type is rejected', () => {
  expectTypeOf<{ name: 'has_lyrics'; type: 'string'; optional: false }>()
    .not.toMatchTypeOf<TsField<'has_lyrics'>>();
});
