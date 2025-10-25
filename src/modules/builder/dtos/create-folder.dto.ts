import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateFolderDto{

    @IsString()
    @IsNotEmpty()

    title:string

    @IsArray()
    items:ObjectId[]

}