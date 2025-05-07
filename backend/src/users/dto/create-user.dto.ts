import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom d'utilisateur unique",
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Mot de passe utilisateur',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Identifiant du groupe (si applicable)',
    example: 'grp-123',
  })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Est-ce que cet utilisateur est le chef du groupe ?',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isGroupLeader?: boolean;

  @ApiPropertyOptional({
    description: 'Nom du groupe (si applicable)',
    example: 'RockFans',
  })
  @IsString()
  @IsOptional()
  groupName?: string;

  @ApiPropertyOptional({
    description: "Nom d'utilisateur Spotify lié",
    example: 'spotify_john',
  })
  @IsString()
  @IsOptional()
  spotifyUsername?: string;

  @ApiPropertyOptional({
    description: 'Token d’accès Spotify lié au compte',
    example: 'BQD1234abcdtoken...',
  })
  @IsString()
  @IsOptional()
  spotifyToken?: string;
}
