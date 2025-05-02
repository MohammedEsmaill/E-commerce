import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { subCategoryModule } from './modules/subCategory/subCategory.module';
import { brandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { GlobalModule } from './modules/global-module/global.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    GlobalModule,
    userModule,
    CategoryModule,
    subCategoryModule,
    brandModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
