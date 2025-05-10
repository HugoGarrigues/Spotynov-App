import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: "Nom d'utilisateur (si modifié)",
    example: 'newusername',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'Nouveau mot de passe (si modifié)',
    example: 'newpassword456',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Est-ce le chef du groupe ?',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isGroupLeader?: boolean;

  @ApiPropertyOptional({
    description: 'Nouveau nom de groupe (si applicable)',
    example: 'groupe2',
  })
  @IsString()
  @IsOptional()
  groupName?: string;

  @ApiPropertyOptional({
    description: 'Nom Spotify lié (si mis à jour)',
    example: 'spotify_newname',
  })
  @IsString()
  @IsOptional()
  spotifyAccessToken?: string;

  @ApiPropertyOptional({
    description: 'Nouveau token Spotify',
    example: 'BQD5678efghtoken...',
  })
  @IsString()
  @IsOptional()
  spotifyRefreshToken?: string;

  @ApiPropertyOptional({
    description: 'Id Spotify de l’utilisateur',
    example: 'spotify_user_id',
  })
  @IsString()
  @IsOptional()
  spotifyUserId?: string;

}
