import { Transform, Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ObjectId } from "mongodb"

export class CreateProductVariantDto{


    @IsNotEmpty()
    @Transform( (obj) => new ObjectId(obj.value as string))
    product:ObjectId
    @IsString()
    @IsNotEmpty()
    size:string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price:number
}