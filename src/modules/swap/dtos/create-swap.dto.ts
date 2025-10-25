import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateSwapDto{

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    @Transform(obj => new ObjectId(String(obj.value)))
    productFrom:ObjectId

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    @Transform(obj => new ObjectId(String(obj.value)))
    to:ObjectId

    @IsNotEmpty()
    @Transform(obj => new ObjectId(String(obj.value)))
    productTo:ObjectId

}