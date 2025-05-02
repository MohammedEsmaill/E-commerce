import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class createCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string;
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    quantity: number;
}

export class updateCartDto extends createCartDto {}