import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BrandRepositoryService, CategoryRepositoryService, ProductRepositoryService, SubCategoryRepositoryService, UserRepositoryService } from 'src/DB/Repository';
import { BrandModel, categoryModel, productModel, subCategoryModel, userModel } from 'src/DB/models';
import { TokenService } from 'src/common/service/token';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { brandService } from '../brand/brand.service';
import { SubCategoryService } from '../subCategory/subCategory.service';

@Module({
  imports: [userModel,categoryModel,subCategoryModel,BrandModel,productModel],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepositoryService,SubCategoryService,SubCategoryRepositoryService,UserRepositoryService,TokenService,JwtService,FileUploadService,brandService,BrandRepositoryService,ProductRepositoryService]
})
export class CategoryModule {}
