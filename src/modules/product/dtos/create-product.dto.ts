import { Transform, Type } from "class-transformer"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ObjectId } from "mongodb"


class ProductVariantDto{

    @IsString()
    @IsNotEmpty()
    @Type(() => ObjectId)
    product:ObjectId

    @IsString()
    @IsNotEmpty()
    size:string

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price:number

}

export class CreateProductDto{

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    title:string
    
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price:number

    @IsArray()
    @IsNotEmpty()
    sizes:string[]

    @IsString()
    @IsNotEmpty()
    description:string
    
    @Transform(obj =>  obj.value === 'true' || obj.value === true ? true : false)
    @IsBoolean()
    @IsNotEmpty()
    swappable:boolean

    @IsString()
    @IsNotEmpty()
    categoryId:string
}