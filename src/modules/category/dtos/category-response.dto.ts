import { Expose, Transform } from "class-transformer"

export class CategoryResponseDto{
    @Expose()
      @Transform((params)=>{params.obj._id})
    _id:string

    @Expose()
    name:string

    @Expose()
    image:string
}