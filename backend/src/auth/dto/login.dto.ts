import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'Le nom d\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Le mot de passe' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
