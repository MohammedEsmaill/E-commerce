import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CustomPasswordDecorator } from "src/common/decorators/customPassword.decorator";
import { genderTypes, otpTypes, rolesTypes } from "src/common/Types/types";

export class signUpDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    name: string;
    @IsEmail()
    email: string;
    @IsDate()
    @Transform(({ value }) => new Date(value))
    DOB: Date;
    @IsString()
    password: string
    @CustomPasswordDecorator({ message: "password not match" })
    confirmPassword: string
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone: string
    @IsString()
    @IsNotEmpty()
    address: string
    @IsEnum(genderTypes)
    @IsOptional()
    gender: string
}

export class confirmEmailDto {
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string
    @IsEnum(otpTypes)
    otpType: string
}

export class loginDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string
}

export class resetPasswordDto {
    @IsEmail()
    email: string
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string
    @IsString()
    password: string
}

export class changePasswordDto extends loginDto{
    @IsString()
    newPassword: string
}

export class sendOtpDto {
    @IsEmail()
    email: string
    @IsString()
    @IsEnum(otpTypes)
    otpType: string
}

export class updateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @IsOptional()
    name: string
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @IsOptional()
    phone: string
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    DOB: Date
    @IsString()
    @IsOptional()
    address: string
    @IsEnum(genderTypes)
    @IsOptional()
    gender: string
}