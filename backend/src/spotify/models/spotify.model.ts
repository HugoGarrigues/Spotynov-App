export type SpotifyProfile = {
    display_name: string;
  };
  
  export type SpotifyCurrentlyPlaying = {
    item: {
      name: string;
      artists: { name: string }[];
      album: { name: string };
    };
    device?: { name?: string };
  };

  export interface SpotifyTrackSyncResponse {
  item: {
    uri: string;
    name: string;
    artists: { name: string }[];
  };
  progress_ms: number;
}

  