import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom d'utilisateur unique",
    example: 'monsieur',
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
}
