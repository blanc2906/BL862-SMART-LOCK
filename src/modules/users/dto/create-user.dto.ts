import { IsNotEmpty, IsString, IsArray, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString({ each: true })
    cardNumbers?: string[];
}
