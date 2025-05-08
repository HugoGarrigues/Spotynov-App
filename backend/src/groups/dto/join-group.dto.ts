import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class JoinGroupDto {
  @ApiProperty({ description: "Nom du groupe à rejoindre", example: 'groupe1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  groupName: string;
}
