import { Controller, Get, Query, Res } from '@nestjs/common';
import { SpotifyService } from '../services/spotify.service';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('spotify')
@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('login')
  @ApiOperation({ summary: 'Génère l\'URL de connexion Spotify' })
  async login(@Res() res: Response) {
    const url = this.spotifyService.getSpotifyAuthUrl();
    return res.json({ url });
  }

  @Get('callback')
  @ApiOperation({ summary: 'Callback Spotify pour échanger le code contre token' })
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.spotifyService.handleSpotifyCallback(code);
    return res.json(tokens);
  }
}
