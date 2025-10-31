import { Expose, Transform } from "class-transformer"
import { ObjectId } from "mongodb"
import { CategoryResponseDto } from "src/modules/category/dtos/category-response.dto"


export class ProductResponseDto{

    @Expose()
    @Transform((params)=>{ return params.obj._id})
    _id:ObjectId
    
    @Expose()
    title:string

    @Expose()
    name:string

    @Expose()
    @Transform((params)=>{ return params.obj._id})
    category:ObjectId

    @Expose()
    price:number

    @Expose()
    sizes:string[]

    @Expose()
    description:string

    @Expose()
    swappable:boolean

    @Expose()
    images:string[]

    @Expose()
    user:string
}