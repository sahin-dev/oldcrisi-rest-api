import { ObjectId } from "mongodb";
import { OrderStatusEnum } from "../enums/orderStatus.enum";
import { IsIn, IsMongoId, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateOrderStatusDto{
   

    @IsString()
    @IsIn(["shipped", "completed", "canceled"])
    status:OrderStatusEnum
}