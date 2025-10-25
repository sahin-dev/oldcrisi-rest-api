import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateChatDto {

    @IsString()
    @IsMongoId()
    @Transform(obj => new ObjectId(obj.value as string))
    receiver:ObjectId

    @IsString()
    @IsNotEmpty()
    message:string

}