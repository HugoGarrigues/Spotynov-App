import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class SpotifyService {
  constructor(private usersService: UsersService) {}

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

    await this.usersService.updateSpotifyTokens(username, tokenData.access_token, tokenData.refresh_token);

    return {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
    };
  }
}
