import { IsNotEmpty, IsString } from "class-validator";

export class DeviceDto{
    @IsString()
    @IsNotEmpty()
    deviceSerial : string;

    @IsString()
    description : string;

    homeBelong ?: string;

}