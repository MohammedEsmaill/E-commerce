import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class FilterQueryDto {
    @IsString()
    @IsOptional()
    select?: string
    @IsString()
    @IsOptional()
    sort?: string
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    page?: number
}