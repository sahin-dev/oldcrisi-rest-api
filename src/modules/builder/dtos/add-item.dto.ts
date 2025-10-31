import { Transform } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class AddItemDto {   

    @IsNotEmpty()
    @Transform(obj => new ObjectId(obj.value as string))
    folderId:ObjectId

    @IsNotEmpty()
    @Transform(obj => new ObjectId(obj.value as string))
    item:ObjectId
}