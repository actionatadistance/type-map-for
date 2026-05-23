import { it, expectTypeOf } from 'vitest';
import type { BigQueryFieldMap } from '..';
import type { QobuzTrack } from './qobuz-track.d';

type BqMap = BigQueryFieldMap<QobuzTrack>;
type BqField<K extends keyof QobuzTrack> = Extract<BqMap[number], { name: K }>;

it('required string → STRING, REQUIRED', () => {
  expectTypeOf<BqField<'track_title'>['type']>().toEqualTypeOf<'STRING'>();
  expectTypeOf<BqField<'track_title'>['mode']>().toEqualTypeOf<'REQUIRED'>();
});

it('optional string → STRING, NULLABLE', () => {
  expectTypeOf<BqField<'lyrics'>['type']>().toEqualTypeOf<'STRING'>();
  expectTypeOf<BqField<'lyrics'>['mode']>().toEqualTypeOf<'NULLABLE'>();
});

it('optional string array → STRING, REPEATED (no [] on type)', () => {
  expectTypeOf<BqField<'genres'>['type']>().toEqualTypeOf<'STRING'>();
  expectTypeOf<BqField<'genres'>['mode']>().toEqualTypeOf<'REPEATED'>();
});

it('optional object array → JSON, REPEATED', () => {
  expectTypeOf<BqField<'track_main_artists'>['type']>().toEqualTypeOf<'JSON'>();
  expectTypeOf<BqField<'track_main_artists'>['mode']>().toEqualTypeOf<'REPEATED'>();
});

it('boolean → BOOL, REQUIRED', () => {
  expectTypeOf<BqField<'has_lyrics'>['type']>().toEqualTypeOf<'BOOL'>();
  expectTypeOf<BqField<'has_lyrics'>['mode']>().toEqualTypeOf<'REQUIRED'>();
});

it('number → INT64 | FLOAT (ambiguous until overridden)', () => {
  expectTypeOf<BqField<'popularity'>['type']>().toEqualTypeOf<'INT64' | 'FLOAT'>();
});

it('description is always optional', () => {
  expectTypeOf<BqField<'track_title'>['description']>()
    .toEqualTypeOf<string | undefined>();
});

it('full QobuzTrack map compiles', () => {
  const map: BqMap = [
    { name: 'qobuz_track_id',        type: 'STRING', mode: 'REQUIRED' },
    { name: 'roon_track_id',         type: 'STRING', mode: 'REQUIRED' },
    { name: 'roon_album_id',         type: 'STRING', mode: 'REQUIRED' },
    { name: 'roon_recording_id',     type: 'STRING', mode: 'NULLABLE' },
    { name: 'track_number',          type: 'INT64',  mode: 'NULLABLE' },
    { name: 'roon_lyrics_id',        type: 'STRING', mode: 'NULLABLE' },
    { name: 'track_title',           type: 'STRING', mode: 'REQUIRED', description: 'display title' },
    { name: 'album_title',           type: 'STRING', mode: 'REQUIRED' },
    { name: 'album_artist',          type: 'STRING', mode: 'REQUIRED' },
    { name: 'track_main_artists',    type: 'JSON',   mode: 'REPEATED' },
    { name: 'popularity',            type: 'FLOAT',  mode: 'REQUIRED' },
    { name: 'lyrics',                type: 'STRING', mode: 'NULLABLE' },
    { name: 'has_lyrics',            type: 'BOOL',   mode: 'REQUIRED' },
    { name: 'genres',                type: 'STRING', mode: 'REPEATED' },
    { name: 'form',                  type: 'STRING', mode: 'NULLABLE' },
    { name: 'period',                type: 'STRING', mode: 'NULLABLE' },
    { name: 'composition_title',     type: 'STRING', mode: 'NULLABLE' },
    { name: 'original_release_year', type: 'INT64',  mode: 'NULLABLE' },
    { name: 'album_labels',          type: 'STRING', mode: 'REPEATED' },
    { name: 'length_seconds',        type: 'INT64',  mode: 'NULLABLE' },
  ];
  expectTypeOf(map).toMatchTypeOf<BqMap>();
});

it('wrong mode on required scalar is rejected', () => {
  expectTypeOf<{ name: 'track_title'; type: 'STRING'; mode: 'REPEATED' }>()
    .not.toMatchTypeOf<BqField<'track_title'>>();
});

it('wrong mode on array field is rejected', () => {
  expectTypeOf<{ name: 'genres'; type: 'STRING'; mode: 'REQUIRED' }>()
    .not.toMatchTypeOf<BqField<'genres'>>();
});

it('[] suffix on type is rejected for BigQuery', () => {
  expectTypeOf<{ name: 'genres'; type: 'STRING[]'; mode: 'REPEATED' }>()
    .not.toMatchTypeOf<BqField<'genres'>>();
});
