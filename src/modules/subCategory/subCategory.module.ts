import { Module } from '@nestjs/common';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { BrandRepositoryService, CategoryRepositoryService, ProductRepositoryService, SubCategoryRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { BrandModel, categoryModel, productModel, subCategoryModel, userModel } from 'src/DB/models';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { brandService } from '../brand/brand.service';

@Module({
  imports: [userModel,categoryModel,subCategoryModel,BrandModel,productModel],
  controllers: [SubCategoryController],
  providers: [SubCategoryService,SubCategoryRepositoryService,CategoryRepositoryService,UserRepositoryService,TokenService,JwtService,FileUploadService,brandService,BrandRepositoryService,ProductRepositoryService]
})
export class subCategoryModule {}
