import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponRepositoryService } from 'src/DB/Repository/coupon.repository.service';
import { CouponModel, userModel } from 'src/DB/models';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from "src/DB/Repository/index";

@Module({
  imports: [CouponModel,userModel],
  controllers: [CouponController],
  providers: [CouponService,CouponRepositoryService,UserRepositoryService,TokenService,JwtService]
})
export class CouponModule {}
