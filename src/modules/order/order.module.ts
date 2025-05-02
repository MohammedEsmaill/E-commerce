import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartRepositoryService, CouponRepositoryService, OrderRepositoryService, ProductRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { CartModel, CouponModel, OrderModel, productModel, userModel } from 'src/DB/models';
import { StripeService } from './service/stripe';

@Module({
  imports: [userModel,OrderModel,CartModel,CouponModel,productModel],
  controllers: [OrderController],
  providers: [OrderService,OrderRepositoryService,UserRepositoryService,TokenService,JwtService,CartRepositoryService,StripeService,CouponRepositoryService,ProductRepositoryService]
})
export class OrderModule {}
