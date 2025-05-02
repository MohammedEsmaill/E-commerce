import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { userModel, BrandModel, productModel } from "src/DB/models";
import { BrandRepositoryService, ProductRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/service/fileUpload.service';

@Module({
  imports: [userModel,BrandModel,productModel],
  controllers: [ProductController],
  providers: [ProductService,UserRepositoryService,TokenService,JwtService,BrandRepositoryService,ProductRepositoryService,FileUploadService]
})
export class ProductModule {}
