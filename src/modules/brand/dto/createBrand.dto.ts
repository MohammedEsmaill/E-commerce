import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class createBrandDto {
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
    subCategoryId: string
}

export class UpdateBrandDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string;
    @IsObject()
    @IsOptional()
    image: object;
}