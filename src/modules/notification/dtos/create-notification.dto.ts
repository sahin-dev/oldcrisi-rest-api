import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateNotificationDto{

    @IsMongoId()
    @IsNotEmpty()
    receiver:ObjectId

    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    description:string

}