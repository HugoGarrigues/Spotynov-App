import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    id ?: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
