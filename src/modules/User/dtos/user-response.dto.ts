import { Expose, Transform } from "class-transformer"
import { ObjectId } from "mongodb"

export class userResponseDto{
    @Expose()
    @Transform((params)=>{
     
        return params.obj._id
    })
    _id:ObjectId

    @Expose()
    fullName:string

    @Expose()
    email:string

    @Expose()
    avatar:string

    @Expose()
    phone:string

    @Expose()
    role:string

    @Expose()
    address:string
}