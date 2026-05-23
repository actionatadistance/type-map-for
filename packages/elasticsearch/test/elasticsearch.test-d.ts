import { it, expectTypeOf } from 'vitest';
import type { ElasticsearchProperties } from '@type-map-for/elasticsearch';

/* ── test interface with nested objects ─────────────────────────── */
interface Artist {
  name: string;
  role?: string;
}

interface Track {
  title:    string;
  duration: number;
  explicit: boolean;
}

interface Album {
  title:      string;
  year?:      number;
  label?:     string;
  tracks:     Track[];      // array of structs  → nested
  lead_artist: Artist;      // plain struct       → object
  genres?:    string[];     // array of strings   → text (implicit)
  popularity: number;
}

type Props = ElasticsearchProperties<Album>;

/* ── primitive fields ───────────────────────────────────────────── */
it('required string → text', () => {
  expectTypeOf<Props['title']['type']>().toEqualTypeOf<'text'>();
});

it('optional number → integer | float', () => {
  expectTypeOf<Props['year']['type']>().toEqualTypeOf<'integer' | 'float'>();
});

/* ── plain nested object → type: object with properties ─────────── */
it('plain object field → type: object', () => {
  expectTypeOf<Props['lead_artist']['type']>().toEqualTypeOf<'object'>();
});

it('plain object field has properties', () => {
  type LeadArtist = Props['lead_artist'];
  expectTypeOf<LeadArtist>().toMatchTypeOf<{
    type: 'object';
    properties: { name: { type: 'text' }; role: { type: 'text' } };
  }>();
});

it('nested object property types are correct', () => {
  type ArtistProps = Extract<Props['lead_artist'], { type: 'object' }>['properties'];
  expectTypeOf<ArtistProps['name']['type']>().toEqualTypeOf<'text'>();
  expectTypeOf<ArtistProps['role']['type']>().toEqualTypeOf<'text'>();
});

/* ── array of objects → type: nested with properties ────────────── */
it('array of structs → type: nested', () => {
  expectTypeOf<Props['tracks']['type']>().toEqualTypeOf<'nested'>();
});

it('nested array has properties', () => {
  type Tracks = Props['tracks'];
  expectTypeOf<Tracks>().toMatchTypeOf<{
    type: 'nested';
    properties: {
      title:    { type: 'text' };
      duration: { type: 'integer' | 'float' };
      explicit: { type: 'boolean' };
    };
  }>();
});

/* ── array of primitives → flat scalar type (arrays implicit) ───── */
it('string array → text (no nested, no suffix)', () => {
  expectTypeOf<Props['genres']['type']>().toEqualTypeOf<'text'>();
});

it('string array field has no properties key', () => {
  expectTypeOf<Props['genres']>().not.toMatchTypeOf<{ properties: any }>();
});

/* ── the output is an object, not an array ──────────────────────── */
it('output is a keyed object, not an array', () => {
  expectTypeOf<Props>().not.toMatchTypeOf<Array<any>>();
  expectTypeOf<Props>().toMatchTypeOf<Record<string, unknown>>();
});

/* ── negative: wrong type for nested field is rejected ──────────── */
it('wrong type for primitive field is rejected', () => {
  expectTypeOf<{ type: 'boolean' }>()
    .not.toMatchTypeOf<Props['title']>();
});

it('flat descriptor rejected where nested expected', () => {
  expectTypeOf<{ type: 'object' }>()
    .not.toMatchTypeOf<Props['lead_artist']>();
});

/* ── QobuzTrack: generic object[] still maps to object (no recurse) */
interface QobuzTrack {
  title:         string;
  track_artists: object[];  // generic object — no shape to recurse into
}

it('generic object[] → type: object (no properties)', () => {
  type QProps = ElasticsearchProperties<QobuzTrack>;
  expectTypeOf<QProps['track_artists']['type']>().toEqualTypeOf<'object'>();
  expectTypeOf<QProps['track_artists']>().not.toMatchTypeOf<{ properties: any }>();
});
