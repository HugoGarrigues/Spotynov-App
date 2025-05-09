import { Module } from '@nestjs/common';
import { SpotifyService } from './services/spotify.service';
import { SpotifyController } from './controllers/spotify.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], 
  providers: [SpotifyService],
  controllers: [SpotifyController],
})
export class SpotifyModule {}
