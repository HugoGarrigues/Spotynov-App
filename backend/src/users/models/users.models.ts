export interface User {
    id: number;
    username: string;
    password: string;
    groupId?: string | null;
    isGroupLeader?: boolean;
    groupName?: string | null;
    spotifyUsername?: string | null;
    spotifyToken?: string | null;
  }
  