import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { PolicyEnum } from "../enums/PolicyEnum";

export class CreatePolicyDto{

    @IsString()
    @IsNotEmpty()
    @IsIn(Object.values(PolicyEnum))
    type: PolicyEnum

    @IsString()
    @IsNotEmpty()
    content:string
}