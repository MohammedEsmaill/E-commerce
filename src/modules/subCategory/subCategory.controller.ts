import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/createSubCategory.dto';
import {  SubCategoryService } from './subCategory.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageAllowedExtensions } from 'src/common/Types/Extinsions';
import { multerHost } from 'src/common/utils/multerHost';
import { Types } from 'mongoose';
@Controller('subCategory')
// @Controller('subCategory')
export class SubCategoryController {
    constructor(private readonly SCS: SubCategoryService) {}
    // ----------------------------- createSubCategory -----------------------------
    @Post("create")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async createCategory(
        @Body() body: CreateSubCategoryDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.SCS.createSubCategory(body,user,file);
    }
    
    // ----------------------------- updateSubCategory -----------------------------
    @Patch("update/:id")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async updateSubCategory(
        @Body() body: UpdateSubCategoryDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File,
        @Param("id") id:Types.ObjectId
    ) {
        return this.SCS.updateSubCategory(body,user,file,id);
    }
    // ---------------------------- deleteSubCategory -----------------------------
    @Delete("delete/:id")
    @Auth(rolesTypes.admin)
    async deleteSubCategory(@User() user:UserDocument,@Param("id") id:Types.ObjectId) {
        return this.SCS.deleteSubCategory(user,id);
    }
}
