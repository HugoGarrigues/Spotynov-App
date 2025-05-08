export interface User {
    username: string;
    password: string;
    isGroupLeader?: boolean;
    groupName?: string | null;
    spotifyUsername?: string | null;
    spotifyToken?: string | null;
  }
  