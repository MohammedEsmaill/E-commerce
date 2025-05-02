import { Module } from '@nestjs/common';
import { brandController } from './brand.controller';
import { brandService } from './brand.service';
import { BrandRepositoryService, ProductRepositoryService, SubCategoryRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import {  BrandModel, categoryModel, productModel, subCategoryModel, userModel } from 'src/DB/models';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { ProductService } from '../product/product.service';

@Module({
  imports: [userModel,subCategoryModel,BrandModel,productModel],
  controllers: [brandController],
  providers: [brandService,BrandRepositoryService,SubCategoryRepositoryService,UserRepositoryService,TokenService,JwtService,FileUploadService,ProductRepositoryService]
})
export class brandModule {}
