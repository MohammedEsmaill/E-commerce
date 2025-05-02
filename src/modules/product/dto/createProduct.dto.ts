import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength, Min, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Type } from "class-transformer";
import { FilterQueryDto } from "src/common/utils/filter-query.Dto";

@ValidatorConstraint({ async: false })
export class IsStockLessThanQuantity implements ValidatorConstraintInterface {
  validate(stock: any, args: ValidationArguments) {
    if (stock > args.object["quantity"]) {
        return false
    }
    return true
  }

  defaultMessage(args?: ValidationArguments): string {
      return `${args?.property} must be less than ${args?.object["quantity"]}`
  }
}
export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsNotEmpty()
    name: string;
    mainImage: object;
    @IsArray()
    @IsOptional()
    subImages: object[];
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    description: string;
    @IsNumber()
    @Type(()=>Number)
    @IsNotEmpty()
    price: number;
    @IsNumber()
    @Type(()=>Number)
    @IsNotEmpty()
    quantity: number;
    @IsNumber()
    @Type(()=>Number)
    @IsNotEmpty()
    @Validate(IsStockLessThanQuantity)
    stock: number;
    @IsNumber()
    @Type(()=>Number)
    @Min(1)
    @Max(100)
    @IsOptional()
    discount: number;
    @IsString()
    @IsNotEmpty()
    brandId: string
}

export class UpdateProductDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string;
    mainImage: object;
    @IsArray()
    @IsOptional()
    subImages: object[];
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    @IsOptional()
    description: string;
    @IsNumber()
    @Type(()=>Number)
    @IsOptional()
    price: number;
    @IsNumber()
    @Type(()=>Number)
    @IsOptional()
    quantity: number;
    @IsNumber()
    @Type(()=>Number)
    @IsOptional()
    @Validate(IsStockLessThanQuantity)
    stock: number;
    @IsNumber()
    @Type(()=>Number)
    @Min(1)
    @Max(100)
    @IsOptional()
    discount: number;
}

 export class QueryDto extends FilterQueryDto {
     @IsString ()
     @IsOptional()
     name?: string
 }