import { IsNotEmpty, IsString } from "class-validator";

export class AddAddressDto{
    
    @IsString()
    @IsNotEmpty()
    address:string
}