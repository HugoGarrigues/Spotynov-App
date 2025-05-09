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
  