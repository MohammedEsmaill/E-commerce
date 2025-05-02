import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSubCategoryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsNotEmpty()
    name: string;
    @IsObject()
    @IsOptional()
    image: object;
    @IsNotEmpty()
    @IsString()
    categoryId: string
}

export class UpdateSubCategoryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string;
    @IsObject()
    @IsOptional()
    image: object;
}