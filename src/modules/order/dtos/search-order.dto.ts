import { IsIn, IsNumber, IsOptional, IsString } from "class-validator"
import { OrderStatusEnum } from "../enums/orderStatus.enum"
import { Transform } from "class-transformer"

export class SearchOrderDto {

    @IsString()
    @IsOptional()
    @IsIn(Object.values(OrderStatusEnum))
    status:string

    @IsString()
    @IsIn(["asc", 'desc'])
    @IsOptional()
    order:string

    @IsOptional()
    @IsString()
    @IsIn(["createdAt"])
    sortBy:string

    @IsNumber()
    @IsOptional()
    @Transform(obj => parseInt(obj.value))
    page:number

    @IsNumber()
    @IsOptional()
    @Transform(obj => parseInt(obj.value))
    limit:number
}