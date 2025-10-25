import { Transform, Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { SwapStatusEnum } from "../enums/swapStatus.enum";

export class UpdateSwapDto{


    @IsString()
    @IsIn(["rejected", "accepted", "completed"])

    status:SwapStatusEnum
}