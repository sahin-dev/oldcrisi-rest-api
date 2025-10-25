import { Transform } from "class-transformer"
import { IsOptional } from "class-validator"

export class PaginationDto {
    @IsOptional()
    @Transform(obj => Number(obj.value))
    page?:number

    @IsOptional()
    @Transform(obj => Number(obj.value))
    limit?:number
}