export interface User {
    username: string;
    password: string;
    isGroupLeader?: boolean;
    groupName?: string | null;
    spotifyAccessToken?: string | null;
    spotifyRefreshToken?: string | null;
    spotifyUserId?: string | null;
  }
  