import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateTemplateDto{

    @IsNumber()
    @Transform(obj => Number(obj.value))
    price:number
}