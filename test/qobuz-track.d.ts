export interface QobuzTrack {
  qobuz_track_id: string;
  roon_track_id: string;
  roon_album_id: string;
  roon_recording_id?: string;
  track_number?: number;
  roon_lyrics_id?: string;
  track_title: string;
  album_title: string;
  album_artist: string;
  track_main_artists?: object[];
  popularity: number;
  lyrics?: string;
  has_lyrics: boolean;
  genres?: string[];
  form?: string;
  period?: string;
  composition_title?: string;
  original_release_year?:number;
  album_labels?: string[];
  length_seconds?: number;
}
