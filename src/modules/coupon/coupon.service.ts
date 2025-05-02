import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository.service';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { UserDocument } from 'src/DB/models';

@Injectable()
export class CouponService {
    constructor(private readonly CRS: CouponRepositoryService) {}
    // ---------------------------------- create coupon ----------------------------------
    async createCoupon(body:CreateCouponDto,user:UserDocument) {
        const { code, discount, startAt, expireAt } = body;
        const couponExist = await this.CRS.findOne({ filter: { code } });
        if (couponExist) {
            return new BadRequestException('Coupon already exist');
        }
        const coupon = await this.CRS.create({ code, discount, startAt, expireAt, addedBy: user._id });
        return { coupon };
    }
}
