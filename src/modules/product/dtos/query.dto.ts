import { Transform } from "class-transformer"
import { IsNumberString, IsOptional } from "class-validator"
import { ObjectId } from "mongodb"

export class QueryDto  {    

    @IsOptional()
    q?:string

    @IsOptional()
    @Transform(obj => new ObjectId(obj.value as string))
    category?:ObjectId

    @IsOptional()
    @Transform( obj => parseInt(obj.value))
    maxPrice?:number
    
    @IsOptional()
    @Transform( obj => parseInt(obj.value))
    minPrice?:number

    @IsOptional()
    page?:string

    @IsOptional()
    limit?:string
}