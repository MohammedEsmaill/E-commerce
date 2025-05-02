import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel, productModel, userModel } from 'src/DB/models';
import { CartRepositoryService, ProductRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CartModel,userModel,productModel],
  controllers: [CartController],
  providers: [CartService, CartRepositoryService,UserRepositoryService,TokenService, JwtService,ProductRepositoryService]
})
export class CartModule {}
