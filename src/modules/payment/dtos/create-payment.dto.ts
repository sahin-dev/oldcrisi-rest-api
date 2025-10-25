import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";

export class CreatePaymentDto {
    
    @IsNotEmpty()
    @Transform(obj => new ObjectId(obj.value as string))
    orderId:ObjectId

    @IsNumber()
    @IsOptional()
    
    point_spent:number

}