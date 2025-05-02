import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";
import { paymentMethodTypes } from "src/common/Types/types";

export class createOrderDto {
    @IsString()
    @IsNotEmpty()
    address: string
    @IsString()
    @IsNotEmpty()
    @IsEnum(paymentMethodTypes)
    paymentMethod: string
    @IsString()
    @IsOptional()
    coupon: string
}
