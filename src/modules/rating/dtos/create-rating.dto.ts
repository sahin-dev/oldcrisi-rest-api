import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateRatingDto{

    @IsNotEmpty()
    @Transform(obj => new ObjectId(obj.value as string))
    supplier:ObjectId

    @IsNotEmpty()
    @Transform(obj => new ObjectId(obj.value as string))
    order:ObjectId

    @IsNumber()
    @IsNotEmpty()
    @Min(0.0)
    @Max(5.0)
    point: number

}