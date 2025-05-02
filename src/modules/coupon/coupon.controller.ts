import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models';

@Controller('coupon')
export class CouponController {
    constructor(private readonly CS: CouponService) {}
    // ---------------------------------- create coupon ----------------------------------
    @Post('create')
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async createCoupon(@Body() body: CreateCouponDto,@User() user:UserDocument) {
        return this.CS.createCoupon(body,user);
    }
}
