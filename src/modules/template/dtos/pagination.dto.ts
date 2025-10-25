    // src/common/dtos/pagination.dto.ts
    import { IsOptional, IsNumber, IsPositive, Min } from 'class-validator';
    import { Type } from 'class-transformer';

    export class PaginationDto {
      @IsOptional()
      @IsNumber()
      @IsPositive()
      @Type(() => Number)
      page?: number;

      @IsOptional()
      @IsNumber()
      @IsPositive()
      @Type(() => Number)
      limit?: number;
    }