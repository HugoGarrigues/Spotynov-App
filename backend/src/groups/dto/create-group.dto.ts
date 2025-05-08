import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: "Nom du groupe à créer", example: 'groupe1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  groupName: string; 
}
