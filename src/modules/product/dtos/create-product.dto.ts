import { Type } from "class-transformer"
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

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

    @IsString()
    @IsNotEmpty()
    description:string
    
    @Type(() => Boolean)
    @IsBoolean()
    @IsNotEmpty()
    swappable:boolean

    @IsString()
    @IsNotEmpty()
    categoryId:string

    @IsString()
    @IsNotEmpty()
    @IsIn(['user', 'admin'])
    createdBy:string
}