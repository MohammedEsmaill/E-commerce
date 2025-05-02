import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsNotEmpty()
    name: string;
    @IsObject()
    @IsOptional()
    image: object;
}

export class UpdateCategoryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string;
    @IsObject()
    @IsOptional()
    image: object;
}