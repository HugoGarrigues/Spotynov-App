import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../../users/services/users.service';
import { SpotifyTrackSyncResponse } from '../models/spotify.model';

@Injectable()
export class SpotifyService {
  constructor(private usersService: UsersService) { }

  private clientId = process.env.SPOTIFY_CLIENT_ID as string;
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
  private redirectUri = process.env.SPOTIFY_REDIRECT_URI as string;

  getSpotifyAuthUrl(): string {
    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-read-recently-played',
      'user-top-read',
      'user-read-playback-state',
      'user-library-read',
      'user-top-read playlist-modify-private',
      'user-modify-playback-state',
    ].join(' ');

    return `https://accounts.spotify.com/authorize` +
      `?client_id=${this.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}`;
  }

  async handleSpotifyCallback(code: string, username: string): Promise<{ access_token: string; refresh_token: string }> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', this.redirectUri);
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const tokenData = response.data as { access_token: string; refresh_token: string };
    const access_token = tokenData.access_token;
    const refresh_token = tokenData.refresh_token;

    const profileRes = await axios.get<{ id: string }>('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const spotifyUserId = profileRes.data.id;

    const users = await this.usersService.findAll();

    for (const user of users) {
      if (user.username !== username && user.spotifyUserId === spotifyUserId) {
        user.spotifyAccessToken = null;
        user.spotifyRefreshToken = null;
        user.spotifyUserId = null;
      }
    }

    await this.usersService.writeFile(users);

    await this.usersService.updateSpotifyTokens(username, access_token, refresh_token, spotifyUserId);

    return {
      access_token,
      refresh_token
    };
  }

  async getUserPersonality(username: string): Promise<any> {
    if (!username || username === 'me') {
      throw new Error('Nom d’utilisateur invalide ou non résolu');
    }

    const user = await this.usersService.findOne(username);

    if (!user || !user.spotifyAccessToken) {
      throw new Error('Utilisateur non connecté à Spotify');
    }

    const token = user.spotifyAccessToken;
    const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data as { items: any[] };
    const likedTracks = responseData.items;

    if (!likedTracks.length) {
      throw new Error('Aucun titre liké trouvé');
    }

    const totalPopularity = likedTracks.reduce((sum, item) => sum + item.track.popularity, 0);
    const avgPopularity = totalPopularity / likedTracks.length;

    const totalDuration = likedTracks.reduce((sum, item) => sum + item.track.duration_ms, 0);
    const avgDuration = totalDuration / likedTracks.length;

    return {
      averagePopularity: avgPopularity,
      averageDurationMs: avgDuration,
    };
  }

  async createTopTracksPlaylist(adminUsername: string, targetUsername: string): Promise<any> {
    const users = await this.usersService.findAll();
    const adminUser = users.find(u => u.username === adminUsername);
    const targetUser = users.find(u => u.username === targetUsername);

    if (!adminUser || !targetUser) {
      throw new Error('Utilisateur introuvable');
    }

    if (!adminUser.groupName || adminUser.groupName !== targetUser.groupName) {
      throw new Error('Les deux utilisateurs doivent être dans le même groupe');
    }

    const adminToken = adminUser.spotifyAccessToken;
    const targetToken = targetUser.spotifyAccessToken;

    if (!adminToken || !targetToken) {
      throw new Error('Les deux utilisateurs doivent être connectés à Spotify');
    }

    const topRes = await axios.get<{ items: { uri: string }[] }>(
      'https://api.spotify.com/v1/me/top/tracks?limit=10',
      { headers: { Authorization: `Bearer ${targetToken}` } },
    );

    const uris = topRes.data.items.map(item => item.uri);
    if (uris.length === 0) {
      throw new Error('Aucune musique préférée trouvée pour cet utilisateur');
    }

    const profileRes = await axios.get<{ id: string }>(
      'https://api.spotify.com/v1/me',
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );
    const userId = profileRes.data.id;

    const playlistRes = await axios.post<{ id: string }>(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: `Top 10 de ${targetUsername}`, public: false },
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );
    const playlistId = playlistRes.data.id;

    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris },
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    return { message: 'Playlist créée avec succès', playlistId };
  }

  async syncMusicToGroup(adminUsername: string) {
    const admin = await this.usersService.findOne(adminUsername);
    if (!admin || !admin.isGroupLeader || !admin.groupName || !admin.spotifyAccessToken) {
      throw new Error("L'utilisateur n'est pas autorisé à synchroniser la musique.");
    }

    const groupMembers = this.usersService.findAll().filter(
      u => u.groupName === admin.groupName && u.username !== adminUsername && u.spotifyAccessToken
    );

    const currentTrackRes = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${admin.spotifyAccessToken}`,
      },
    });

    const trackData = currentTrackRes.data as SpotifyTrackSyncResponse;

    if (!trackData || !trackData.item || !trackData.progress_ms) {
      throw new Error("Aucune musique en cours trouvée pour l'administrateur.");
    }

    const trackUri = trackData.item.uri;
    const positionMs = trackData.progress_ms;

    const results: Record<string, string> = {};

    for (const member of groupMembers) {
      try {
        await axios.put(
          'https://api.spotify.com/v1/me/player/play',
          {
            uris: [trackUri],
            position_ms: positionMs,
          },
          {
            headers: {
              Authorization: `Bearer ${member.spotifyAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        results[member.username] = '✅ Success';
      } catch (err) {
        console.error(`Erreur pour ${member.username}:`, err?.response?.data || err.message);
        results[member.username] = '❌ Erreur';
      }
    }

    return {
      message: `Synchronisation lancée pour le groupe ${admin.groupName}`,
      track: {
        name: trackData.item.name,
        artist: trackData.item.artists.map((a: any) => a.name).join(', '),
      },
      results,
    };
  }
}
