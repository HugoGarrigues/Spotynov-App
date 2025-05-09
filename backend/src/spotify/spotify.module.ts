import { Module } from '@nestjs/common';
import { SpotifyController } from './controllers/spotify.controller';
import { SpotifyService } from './services/spotify.service';

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService],
})
export class SpotifyModule {}
