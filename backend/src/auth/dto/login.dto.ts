import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Le nom d\'utilisateur',
    example: 'Stephane', 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Le mot de passe',
    example: 'password123', 
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
