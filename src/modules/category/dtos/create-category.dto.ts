import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3,{message:"category name must be 3 character long"})
    name:string

    @IsNotEmpty()
    image:Express.Multer.File

    
}