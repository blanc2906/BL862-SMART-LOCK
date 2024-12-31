import { IsNotEmpty, IsString } from "class-validator";

export class HomeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address : string;
}