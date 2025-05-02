import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
@ValidatorConstraint({ async: false })
export class IsExpireDateAfterStratDateConstraint implements ValidatorConstraintInterface {
  validate(expireAt: any, args: ValidationArguments) {
    if (expireAt < args.object["startAt"]) {
        return false
    }
    return true
  }
  defaultMessage(args?: ValidationArguments): string {
      return `${args?.property} must be after ${args?.object["expireAt"]}`
  }
}

@ValidatorConstraint({ async: false })
export class IsStratDateInFutureConstraint implements ValidatorConstraintInterface {
  validate(startAt: any, args: ValidationArguments) {
    if (startAt < new Date(Date.now())) {
        return false
    }
    return true
  }
  defaultMessage(args?: ValidationArguments): string {
      return `${args?.property} must be in futuer`
  }
}

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string;
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    @IsPositive()
    discount: number;
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    @Validate(IsStratDateInFutureConstraint)
    startAt: Date;
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    @Validate(IsExpireDateAfterStratDateConstraint)
    expireAt: Date;
}