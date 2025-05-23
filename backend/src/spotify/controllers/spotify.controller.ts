import { Controller, Get, Post,  Query, Res, UseGuards, Req, Param } from '@nestjs/common';
import { SpotifyService } from '../services/spotify.service';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('spotify')
@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('login')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Génère l\'URL de connexion Spotify' })
  async login(@Res() res: Response) {
    const url = this.spotifyService.getSpotifyAuthUrl();
    return res.json({ url });
  }

  @Get('callback')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Callback Spotify pour échanger le code contre token' })
  async callback(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {
    const user = req.user as any; 
    const tokens = await this.spotifyService.handleSpotifyCallback(code, user.username);
    return res.json(tokens);
  }

  @Get('personality/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Analyse de personnalité de soi-même' })
  async getMyPersonality(@Req() req: Request) {
    const user = req.user as any;
    return this.spotifyService.getUserPersonality(user.username);
  }

  @Get('personality/:username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Analyse de personnalité Spotify d’un utilisateur spécifique' })
  @ApiBearerAuth()
  async getPersonalityByUsername(@Param('username') username: string) {
    return this.spotifyService.getUserPersonality(username);
  }

  @Post('playlist/:targetUsername')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une playlist à partir des musiques préférées d’un utilisateur du même groupe' })
  async createPlaylist(
    @Req() req: Request,
    @Param('targetUsername') targetUsername: string,
  ) {
    const sourceUser = req.user as any;
    return this.spotifyService.createTopTracksPlaylist(sourceUser.username, targetUsername);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synchronise la musique actuelle de l’admin sur les membres du groupe' })
  async syncMusic(@Req() req: Request) {
    const user = req.user as any;
    return this.spotifyService.syncMusicToGroup(user.username);
  }
}
